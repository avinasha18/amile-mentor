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
import { Actions } from "../../hooks/actions";
import socket from "../../services/socket/socket";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const TanStackTable = () => {
    const columnHelper = createColumnHelper();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const nav = useNavigate();
    const mentorId = useSelector((state) => state.auth.mentorData?._id);
    const isDarkMode = useSelector((state)=>state.theme.isDarkMode)


    useEffect(() => {
        const loadDataAndAssignStudents = async () => {
            try {
                // Fetch student data
                const responseStudent = await Actions.getStudent();
                
                // Fetch average progress data
                const responseAvgProgress = await Actions.getAvgProgress();

                if (responseStudent.data.success && responseAvgProgress.data.success) {
                    // Combine student data with average progress
                    const mappedData = responseStudent.data.studentUsernames.map((username, index) => {
                        const studentProgress = responseAvgProgress.data.studentData.find(
                            (student) => student.username === username
                        );

                        return {
                            id: index + 1, // Assign a sequential ID
                            userName: username,
                            progress: studentProgress ? Math.round(studentProgress.avgProgress) : 0, // Add the average progress
                        };
                    });
                    setData(mappedData);
                } else {
                    console.log("Failed to fetch student or progress data");
                }
            } catch (err) {
                console.error("Error occurred:", err);
            }
        };

        loadDataAndAssignStudents();
    }, []);

    const columns = [
        columnHelper.accessor("index", {
            id: "S.No",
            cell: (info) => <span>{info.getValue()}</span>,
            header: "S.No",
        }),
        columnHelper.accessor("userName", {
            cell: (info) => (
                <a
                    href="#"
                    className="text-indigo-700  hover:text-indigo-600"
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
        columnHelper.accessor("id", {
            cell: (info) => <button className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={()=>startChat(info.getValue())}>Start Chat</button>,
            header: "Actions",
        }),
    ];

    const startChat = (applicantId) => {
        console.log(mentorId)
        socket.emit('startChat', { mentorId, studentId:applicantId }, (response) => {
            console.log(response);
          if (response.success) {
            nav("/mentor/messages")
          } else {
            toast.error('Error starting chat. Please try again.');
          }
        });
      };

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
        <div className={`p-6 w-full h-full  mx-auto ${isDarkMode?"bg-gradient-to-br from-gray-800 via-gray-900 to-black":"bg-gradient-to-br from-white via-white to-white"}  text-gray-900  shadow-2xl backdrop-blur-lg`}>
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
            <table className={`border border-gray-700 w-full text-left rounded-lg shadow-md `}>
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
                                className={`${i % 2 === 0 ? isDarkMode? "bg-gray-800 text-white":"bg-gray-300 text-black" :  isDarkMode? "bg-gray-700 text-white" :"bg-white-300 text-black"} hover:bg-gray-500 transition-transform transform duration-300 rounded-lg`}
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
