import React, { useState, useRef, useMemo } from 'react';
import { User, Role, Letter, LetterStatus, LetterTemplate } from '../types';
import { MOCK_LETTERS, MOCK_LETTER_TEMPLATES, USERS, MOCK_COMPANY, MOCK_WORKSITE } from '../data/mock';
import { KopechLogo } from '../components/KopechLogo';
import SignaturePad from 'react-signature-canvas';

// --- UTILITY FUNCTIONS ---
const getVariablesFromTemplate = (content: string): string[] => {
    const regex = /{{\s*(\w+)\s*}}/g;
    const matches = [...content.matchAll(regex)];
    const variables = matches.map(match => match[1]);
    return [...new Set(variables)]; // Return unique variables
};

const formatVariableLabel = (variableName: string): string => {
    return variableName.replace(/([A-Z])/g, ' $1').trim();
};

const PRE_FILLED_VARS = ['EmployeeName', 'AdminName', 'CompanyName', 'CompanyAddress', 'WorkLocation'];

// --- MODAL COMPONENTS ---

const ManageTemplatesModal: React.FC<{
    templates: LetterTemplate[];
    onClose: () => void;
    onSave: (newTemplate: LetterTemplate) => void;
}> = ({ templates, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleSave = () => {
        if (!name || !content) {
            alert('Template Name and Content are required.');
            return;
        }
        const newTemplate: LetterTemplate = {
            id: `template-${Date.now()}`,
            name,
            description,
            content,
        };
        onSave(newTemplate);
        setIsCreating(false);
        setName('');
        setDescription('');
        setContent('');
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Letter Templates</h2>

                {isCreating ? (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Create New Template</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Template Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-md" />
                            <input type="text" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-md" />
                            <textarea placeholder="Template content with {{placeholders}}..." value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 border rounded-md h-48 font-mono text-sm" />
                        </div>
                         <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-kopech-primary text-white font-semibold rounded-md hover:bg-kopech-secondary">Save Template</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="space-y-2 mb-6">
                        {templates.map(t => (
                            <div key={t.id} className="p-3 bg-gray-50 rounded-md border">
                                <p className="font-semibold">{t.name}</p>
                                <p className="text-sm text-gray-600">{t.description}</p>
                            </div>
                        ))}
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                             <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-kopech-primary text-white font-semibold rounded-md hover:bg-kopech-secondary">Add New Template</button>
                            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const CreateLetterModal: React.FC<{ 
    admin: User; 
    templates: LetterTemplate[];
    onClose: () => void; 
    onIssue: (letter: Letter) => void 
}> = ({ admin, templates, onClose, onIssue }) => {
    const [step, setStep] = useState<'select' | 'fill'>('select');
    const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
    const [employeeId, setEmployeeId] = useState('');
    const [variableValues, setVariableValues] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState<string | null>(null);
    const sigPad = useRef<SignaturePad>(null);

    const employees = Object.values(USERS).filter(u => u.role === Role.Employee);
    
    const requiredVariables = useMemo(() => {
        if (!selectedTemplate) return [];
        return getVariablesFromTemplate(selectedTemplate.content)
            .filter(v => !PRE_FILLED_VARS.includes(v));
    }, [selectedTemplate]);


    const handleTemplateSelect = (template: LetterTemplate) => {
        setSelectedTemplate(template);
        setVariableValues({});
        setStep('fill');
    };
    
    const handleValueChange = (variable: string, value: string) => {
        setVariableValues(prev => ({...prev, [variable]: value}));
    };

    const handleSubmit = () => {
        setError(null);
        if (!employeeId || !selectedTemplate) {
            setError('An employee and template must be selected.');
            return;
        }
        for (const v of requiredVariables) {
            if (!variableValues[v]) {
                setError(`Field "${formatVariableLabel(v)}" is required.`);
                return;
            }
        }
        if (sigPad.current?.isEmpty()) {
            setError('Admin signature is required to issue the letter.');
            return;
        }

        const selectedEmployee = Object.values(USERS).find(u => u.id === employeeId);
        if (!selectedEmployee) {
            setError('Invalid employee selected.');
            return;
        }

        const newSignatureId = `sig-admin-${Date.now()}`;

        const newLetter: Letter = {
            id: `letter-${Date.now()}`,
            employeeId,
            templateId: selectedTemplate.id,
            status: LetterStatus.Issued,
            issuedAt: new Date(),
            adminSignatureId: newSignatureId,
            variables: {
                ...variableValues,
                EmployeeName: selectedEmployee.name,
                WorkLocation: MOCK_WORKSITE.name,
                CompanyName: MOCK_COMPANY.name,
                CompanyAddress: MOCK_COMPANY.address,
                AdminName: admin.name
            }
        };
        onIssue(newLetter);
    };
    
    const clearSignature = () => sigPad.current?.clear();

    const renderSelectStep = () => (
         <div className="space-y-3">
             {templates.map(template => (
                 <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                     <div>
                        <h4 className="font-semibold text-gray-800">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                     </div>
                     <button onClick={() => handleTemplateSelect(template)} className="px-4 py-2 bg-kopech-primary text-white text-sm font-semibold rounded-md hover:bg-kopech-secondary">
                         Select
                     </button>
                 </div>
             ))}
         </div>
    );

    const renderFillStep = () => (
        <div>
            <button onClick={() => setStep('select')} className="text-sm text-kopech-primary hover:underline mb-4">&larr; Back to templates</button>
            <h3 className="text-lg font-bold text-gray-700 mb-4">Fill Details for: <span className="text-kopech-primary">{selectedTemplate?.name}</span></h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                    <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="w-full p-2 border rounded-md">
                        <option value="">Select Employee</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>
                {requiredVariables.map(variable => (
                     <div key={variable}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{formatVariableLabel(variable)}</label>
                        <input 
                            type="text" 
                            value={variableValues[variable] || ''} 
                            onChange={e => handleValueChange(variable, e.target.value)} 
                            className="w-full p-2 border rounded-md" />
                    </div>
                ))}
            </div>

             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Signature</label>
                <div className="border rounded-md bg-gray-50">
                    <SignaturePad ref={sigPad} canvasProps={{ className: 'w-full h-32' }} />
                </div>
                <div className="text-right mt-1">
                    <button onClick={clearSignature} className="text-sm text-gray-600 hover:underline">Clear</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 mb-6">{step === 'select' ? 'Select a Template' : 'Create & Issue New Letter'}</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                
                {step === 'select' ? renderSelectStep() : renderFillStep()}

                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    {step === 'fill' && <button onClick={handleSubmit} className="px-6 py-2 bg-kopech-primary text-white font-semibold rounded-md hover:bg-kopech-secondary">Issue Letter</button>}
                </div>
            </div>
        </div>
    );
};


const LetterPreview: React.FC<{letter: Letter, templates: LetterTemplate[], onClose: () => void, onSign?: (signature: string) => void}> = ({ letter, templates, onClose, onSign }) => {
    const sigPad = useRef<SignaturePad>(null);
    const template = templates.find(t => t.id === letter.templateId);
    
    const clearSignature = () => sigPad.current?.clear();

    const saveSignature = () => {
        if (sigPad.current && !sigPad.current.isEmpty()) {
            const dataUrl = sigPad.current.toDataURL();
            onSign?.(dataUrl);
        }
    }

    const isSignable = letter.status === LetterStatus.Issued;

    const populatedTemplate = useMemo(() => {
        if (!template) {
            return `<p class="text-red-500">Error: Letter template with ID "${letter.templateId}" not found.</p>`;
        }
        let content = template.content;
        for(const key in letter.variables) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            content = content.replace(regex, `<strong>${letter.variables[key]}</strong>`);
        }
        
        const header = `
            <div class="flex items-center mb-8">
                <div class="w-16 h-16 mr-4 text-kopech-primary">${document.querySelector('#root svg')?.outerHTML || ''}</div>
                <div>
                    <h1 class="text-2xl font-bold">${MOCK_COMPANY.name}</h1>
                    <p class="text-sm text-gray-600">${MOCK_COMPANY.address}</p>
                </div>
            </div>`;
        
        return `${header}
            <p class="text-right mb-8">Date: ${new Date(letter.issuedAt || Date.now()).toLocaleDateString()}</p>
            <p class="mb-4">Dear ${letter.variables.EmployeeName},</p>
            ${content}
        `;
    }, [letter, template]);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: populatedTemplate }} />
                
                <div className="mt-8 border-t pt-4">
                    <h3 className="font-semibold mb-2">Signatures</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Admin Signature</p>
                            {letter.adminSignatureId ? <p className="font-mono text-xs p-2 bg-gray-100 rounded">Signed Electronically</p> : <p className="text-gray-400">Not Signed</p>}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Employee Signature</p>
                            {letter.employeeSignatureId ? <p className="font-mono text-xs p-2 bg-gray-100 rounded">Signed Electronically</p> : (
                                onSign && isSignable ? (
                                    <div>
                                        <div className="border rounded-md bg-gray-50">
                                            <SignaturePad ref={sigPad} canvasProps={{ className: 'w-full h-32' }} />
                                        </div>
                                        <div className="flex items-center justify-end mt-2 space-x-2">
                                             <button onClick={clearSignature} className="text-sm text-gray-600 hover:underline">Clear</button>
                                             <button onClick={saveSignature} className="px-4 py-1 bg-kopech-primary text-white text-sm rounded-md hover:bg-kopech-secondary">Sign & Accept</button>
                                        </div>
                                    </div>
                                ) : <p className="text-gray-400">Not Signed</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
                </div>
            </div>
        </div>
    )
}

// --- MAIN SCREEN COMPONENT ---
interface LettersScreenProps {
  currentUser: User;
}

const statusColorMap: { [key in LetterStatus]: string } = {
  [LetterStatus.Draft]: 'bg-gray-200 text-gray-800',
  [LetterStatus.Issued]: 'bg-blue-200 text-blue-800',
  [LetterStatus.EmployeeSigned]: 'bg-yellow-200 text-yellow-800',
  [LetterStatus.Locked]: 'bg-green-200 text-green-800',
  [LetterStatus.Void]: 'bg-red-200 text-red-800',
};


export const LettersScreen: React.FC<LettersScreenProps> = ({ currentUser }) => {
  const [letters, setLetters] = useState<Letter[]>(MOCK_LETTERS);
  const [templates, setTemplates] = useState<LetterTemplate[]>(MOCK_LETTER_TEMPLATES);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isManagingTemplates, setIsManagingTemplates] = useState(false);

  const handleSignLetter = (letterId: string, signature: string) => {
    setLetters(prev => prev.map(l => l.id === letterId ? { ...l, status: LetterStatus.Locked, employeeSignatureId: `sig-emp-${Date.now()}` } : l));
    setSelectedLetter(null);
  }

  const handleIssueLetter = (newLetter: Letter) => {
    setLetters(prev => [newLetter, ...prev]);
    setIsCreating(false);
  };
  
  const handleSaveTemplate = (newTemplate: LetterTemplate) => {
      setTemplates(prev => [...prev, newTemplate]);
  };

  const getVisibleLetters = () => {
    if (currentUser.role === Role.Admin || currentUser.role === Role.Manager) {
        return letters;
    }
    return letters.filter(l => l.employeeId === currentUser.id && l.status !== LetterStatus.Draft);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Employment Letters</h2>
        {currentUser.role === Role.Admin && (
            <div className="flex space-x-2">
                <button 
                    onClick={() => setIsManagingTemplates(true)}
                    className="px-4 py-2 bg-white border border-gray-300 text-kopech-primary font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-kopech-accent focus:ring-opacity-75"
                >
                    Manage Templates
                </button>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-kopech-primary text-white font-semibold rounded-lg shadow-md hover:bg-kopech-secondary focus:outline-none focus:ring-2 focus:ring-kopech-accent focus:ring-opacity-75"
                >
                    Create New Letter
                </button>
            </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600">Employee</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Letter Type</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Issued Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getVisibleLetters().map(letter => {
                    const template = templates.find(t => t.id === letter.templateId);
                    return (
                      <tr key={letter.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                        <td className="p-4">{letter.variables.EmployeeName}</td>
                        <td className="p-4">{template?.name || 'Unknown Template'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[letter.status]}`}>
                            {letter.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">{letter.issuedAt ? new Date(letter.issuedAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4">
                          { (currentUser.role === Role.Employee && letter.status === LetterStatus.Issued) ? (
                             <button onClick={() => setSelectedLetter(letter)} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Review & Sign</button>
                          ) : (
                             <button onClick={() => setSelectedLetter(letter)} className="px-3 py-1 bg-kopech-primary text-white text-sm rounded-md hover:bg-kopech-secondary">View</button>
                          )}
                        </td>
                      </tr>
                    )
                })}
              </tbody>
            </table>
        </div>
      </div>

      {isCreating && currentUser.role === Role.Admin && (
          <CreateLetterModal
            admin={currentUser}
            templates={templates}
            onClose={() => setIsCreating(false)}
            onIssue={handleIssueLetter}
          />
      )}
      
       {isManagingTemplates && currentUser.role === Role.Admin && (
          <ManageTemplatesModal
            templates={templates}
            onClose={() => setIsManagingTemplates(false)}
            onSave={handleSaveTemplate}
          />
      )}

      {selectedLetter && (
        <LetterPreview 
            letter={selectedLetter}
            templates={templates}
            onClose={() => setSelectedLetter(null)} 
            onSign={currentUser.role === Role.Employee ? (sig) => handleSignLetter(selectedLetter.id, sig) : undefined}
        />
      )}
    </div>
  );
};
