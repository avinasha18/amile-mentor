import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie to access cookies
import DownloadBtn from "./DownloadBtn";
import DebouncedInput from "./DebouncedInput";
import UserDetailModal from "./UserDetailModal";
import { fetchUserData } from "./data";
import { Actions } from "../../hooks/actions";

const TanStackTable = () => {
    const columnHelper = createColumnHelper();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        const loadDataAndAssignStudents = async () => {
            try {
                // Get the username from cookies
                const username = Cookies.get('mentor');
    
                if (!username) {
                    console.error("Username cookie not found");
                    return;
                }
    
                const responseStudent = await Actions.getStudent({ username: username });
                if (responseStudent.data.success) {
                    // Map the student usernames into the structure expected by the table
                    const mappedData = responseStudent.data.studentUsernames.map((username, index) => ({
                        id: index + 1, // Assign a sequential ID
                        userName: username,
                        progress: 0 // Add a default progress if needed
                    }));
                    setData(mappedData);
                } else {
                    console.log(responseStudent.data.message);
                }

                // const userData = await fetchUserData(username);
                // setData(userData);
                // console.log(userData);
    
                // const studentUsernames = userData.map(student => student.userName);

                // const response = await Actions.assignStudent({ mentorUsername: username, studentUsername: studentUsername });
    
                // if (response.data.success) {
                //     console.log(response.data.message);
                // } else {
                //     console.log(response.data.message);
                // }
            } catch (err) {
                console.error("Error occurred:", err);
            }
        };
    
        loadDataAndAssignStudents();
    }, []);    

    const columns = [
        columnHelper.accessor("id", {
            id: "S.No",
            cell: (info) => <span>{info.getValue()}</span>,
            header: "S.No",
        }),
        columnHelper.accessor("userName", {
            cell: (info) => (
                <a
                    href="#"
                    className="text-indigo-400 underline hover:text-indigo-600"
                    onClick={() => {
                        setSelectedUser(info.row.original);
                        setIsModalOpen(true);
                    }}
                >
                    {info.getValue()}
                </a>
            ),
            header: "User Name",
        }),
        columnHelper.accessor("progress", {
            cell: (info) => <span>{info.getValue()}%</span>,
            header: "Progress",
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="p-6 max-w-6xl mt-10 mx-auto bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-100 rounded-lg shadow-2xl backdrop-blur-lg">
            <div className="flex justify-between mb-4">
                <div className="w-full flex items-center gap-2">
                    <DebouncedInput
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        className="p-2 bg-gray-800 text-white border-b-2 border-indigo-500 rounded-lg focus:border-indigo-300 transition duration-300"
                        placeholder="Search all columns..."
                    />
                </div>
                <DownloadBtn data={data} fileName={"students"} />
            </div>
            <table className="border border-gray-700 w-full text-left rounded-lg shadow-md bg-gray-800">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-6 py-3 font-medium text-sm">
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row, i) => (
                            <tr
                                key={row.id}
                                className={`${i % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                                    } hover:bg-gray-600 transition-transform transform duration-300 rounded-lg`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4 text-sm">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr className="text-center h-32">
                            <td colSpan={columns.length} className="text-gray-400">
                                No Record Found!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 gap-4 text-gray-300">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 rounded-full border border-gray-600 bg-gray-700 hover:bg-gray-600 shadow-lg transform transition duration-300 disabled:opacity-30"
                >
                    {"<"}
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-2 rounded-full border border-gray-600 bg-gray-700 hover:bg-gray-600 shadow-lg transform transition duration-300 disabled:opacity-30"
                >
                    {">"}
                </button>

                <span className="flex items-center gap-3 text-sm">
                    <div>Page</div>
                    <strong className="text-indigo-400">
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </span>

                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-gray-100 shadow-lg"
                >
                    {[10, 20, 30, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>

            {/* User Detail Modal */}
            <UserDetailModal
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default TanStackTable;
