import { prisma } from "@/lib/db";
import { formatIDR } from "@/lib/utils";

export default async function AdminCustomersPage() {
  // Fetch customers
  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    include: {
      orders: {
        select: {
          id: true,
          total: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div className="mb-lg flex items-center justify-between">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface">Customer Database</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage your enterprise clientele and view transaction histories.</p>
        </div>
        <button className="bg-primary text-on-primary px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-sm hover:bg-surface-tint transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Customer
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg h-[calc(100vh-12rem)] min-h-[600px]">
        {/* Left: Directory Table (Span 2) */}
        <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="px-md py-sm border-b border-outline-variant bg-surface flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
              <span className="font-label-md text-label-md text-on-surface">All Customers</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low sticky top-0 border-b border-outline-variant z-10">
                <tr>
                  <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Name</th>
                  <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Email</th>
                  <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Orders</th>
                  <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Joined At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-on-surface-variant italic">No customers found.</td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-surface-container-low cursor-pointer transition-colors bg-surface-container-lowest border-l-4 border-l-transparent">
                      <td className="py-sm px-md">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant flex-shrink-0 flex items-center justify-center text-primary">
                            {customer.image ? (
                              <img alt={customer.name || "User"} className="w-full h-full object-cover" src={customer.image} />
                            ) : (
                              <span className="material-symbols-outlined">account_circle</span>
                            )}
                          </div>
                          <div>
                            <div className="font-label-md text-label-md text-on-surface">{customer.name || "No Name"}</div>
                            <div className="font-body-sm text-body-sm text-on-surface-variant">{customer.phone || "No Phone"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-sm px-md font-body-sm text-body-sm text-on-surface">{customer.email}</td>
                      <td className="py-sm px-md font-body-sm text-body-sm text-on-surface">{customer.orders.length}</td>
                      <td className="py-sm px-md font-body-sm text-body-sm text-on-surface">
                        {customer.createdAt.toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Placeholder */}
          <div className="px-md py-sm border-t border-outline-variant bg-surface flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Showing {customers.length} entries</span>
          </div>
        </div>

        {/* Right: Selected Customer Placeholder */}
        <div className="xl:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="flex-1 flex flex-col items-center justify-center p-lg text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-md">person_search</span>
            <h3 className="font-h3 text-h3 text-on-surface">Select a Customer</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Click on a customer in the list to view their full profile and transaction history.</p>
          </div>
        </div>
      </div>
    </>
  );
}
