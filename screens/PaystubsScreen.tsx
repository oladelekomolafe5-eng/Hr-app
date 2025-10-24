import React, { useState, useMemo } from 'react';
import { User, Paystub } from '../types';
import { MOCK_PAYSTUBS, MOCK_COMPANY } from '../data/mock';
import { KopechLogo } from '../components/KopechLogo';

const PaystubDetailModal: React.FC<{ paystub: Paystub, onClose: () => void }> = ({ paystub, onClose }) => {
    const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-4 border-b mb-4">
                     <div className="flex items-center">
                        <div className="w-12 h-12 mr-4 text-kopech-primary"><KopechLogo/></div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{MOCK_COMPANY.name}</h3>
                            <p className="text-sm text-gray-500">{MOCK_COMPANY.address}</p>
                        </div>
                     </div>
                     <h2 className="text-2xl font-bold text-kopech-primary">Paystub</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                        <p><strong>Employee:</strong> {MOCK_PAYSTUBS.find(p=>p.employeeId === paystub.employeeId) ? MOCK_COMPANY.name : 'Unknown'}</p>
                        <p><strong>Pay Period:</strong> {new Date(paystub.payPeriodStart).toLocaleDateString()} - {new Date(paystub.payPeriodEnd).toLocaleDateString()}</p>
                        <p><strong>Pay Date:</strong> {new Date(paystub.payDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-lg"><strong>Net Pay:</strong> <span className="font-bold text-green-600">{formatNaira(paystub.netPay)}</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Earnings</h4>
                        {paystub.earnings.map((item, i) => <div key={i} className="flex justify-between py-1"><p>{item.description}</p><p>{formatNaira(item.amount)}</p></div>)}
                        <div className="flex justify-between font-bold pt-2 border-t mt-2">
                            <p>Gross Pay</p>
                            <p>{formatNaira(paystub.grossPay)}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Deductions & Taxes</h4>
                        {paystub.deductions.map((item, i) => <div key={i} className="flex justify-between py-1"><p>{item.description}</p><p>({formatNaira(item.amount)})</p></div>)}
                        {paystub.taxes.map((item, i) => <div key={i} className="flex justify-between py-1"><p>{item.description}</p><p>({formatNaira(item.amount)})</p></div>)}
                        <div className="flex justify-between font-bold pt-2 border-t mt-2">
                            <p>Total Deductions & Taxes</p>
                            <p>({formatNaira(paystub.grossPay - paystub.netPay)})</p>
                        </div>
                    </div>
                </div>

                 <div className="mt-8 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
                </div>
            </div>
        </div>
    );
};

export const PaystubsScreen: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [selectedPaystub, setSelectedPaystub] = useState<Paystub | null>(null);
  const myPaystubs = useMemo(() => {
    return MOCK_PAYSTUBS.filter(p => p.employeeId === currentUser.id)
      .sort((a, b) => new Date(b.payDate).getTime() - new Date(a.payDate).getTime());
  }, [currentUser.id]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Paystubs</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600">Pay Period</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Pay Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Gross Pay</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Net Pay</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myPaystubs.map(paystub => (
                  <tr key={paystub.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                    <td className="p-4">{new Date(paystub.payPeriodStart).toLocaleDateString()} - {new Date(paystub.payPeriodEnd).toLocaleDateString()}</td>
                    <td className="p-4">{new Date(paystub.payDate).toLocaleDateString()}</td>
                    <td className="p-4">₦{paystub.grossPay.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-green-700">₦{paystub.netPay.toLocaleString()}</td>
                    <td className="p-4">
                        <button onClick={() => setSelectedPaystub(paystub)} className="px-3 py-1 bg-kopech-primary text-white text-sm rounded-md hover:bg-kopech-secondary">View Details</button>
                    </td>
                  </tr>
                ))}
                 {myPaystubs.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">You have no paystubs available.</td>
                    </tr>
                 )}
              </tbody>
            </table>
        </div>
      </div>
       {selectedPaystub && <PaystubDetailModal paystub={selectedPaystub} onClose={() => setSelectedPaystub(null)} />}
    </div>
  );
};
