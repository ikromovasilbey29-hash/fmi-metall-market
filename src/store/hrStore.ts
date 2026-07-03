import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  salary: number;
  startDate: string;
  status: "active" | "inactive";
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "present" | "absent" | "late" | "half";
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: string; // "2026-06"
  baseSalary: number;
  bonus: number;
  deduction: number;
  total: number;
  paid: boolean;
  paidDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // employeeId
  priority: "low" | "medium" | "high";
  status: "todo" | "inprogress" | "done";
  dueDate: string;
  createdAt: string;
}

interface HRStore {
  employees: Employee[];
  attendance: AttendanceRecord[];
  salaries: SalaryRecord[];
  tasks: Task[];

  // Employees
  addEmployee: (e: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Attendance
  markAttendance: (record: Omit<AttendanceRecord, "id">) => void;
  updateAttendance: (id: string, data: Partial<AttendanceRecord>) => void;

  // Salary
  addSalary: (s: Omit<SalaryRecord, "id">) => void;
  markSalaryPaid: (id: string) => void;

  // Tasks
  addTask: (t: Omit<Task, "id" | "createdAt">) => void;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  deleteTask: (id: string) => void;
}

const initialEmployees: Employee[] = [
  { id: "emp1", name: "Jasur Mirzayev", position: "Omborchi", department: "Ombor", phone: "+998 91 111 11 11", salary: 3500000, startDate: "2024-01-15", status: "active" },
  { id: "emp2", name: "Nodira Xasanova", position: "Kassir", department: "Moliya", phone: "+998 93 222 22 22", salary: 2800000, startDate: "2024-03-01", status: "active" },
  { id: "emp3", name: "Sherzod Toshev", position: "Haydovchi", department: "Yetkazish", phone: "+998 90 333 33 33", salary: 3000000, startDate: "2023-11-10", status: "active" },
  { id: "emp4", name: "Dilrabo Ergasheva", position: "Menejer", department: "Sotuv", phone: "+998 99 444 44 44", salary: 4000000, startDate: "2023-06-20", status: "active" },
];

const today = new Date().toISOString().split("T")[0];

const initialTasks: Task[] = [
  { id: "t1", title: "Omborni tartibga keltirish", description: "Barcha mahsulotlarni qaytadan sanab chiqish", assignedTo: "emp1", priority: "high", status: "inprogress", dueDate: "2026-07-05", createdAt: new Date().toISOString() },
  { id: "t2", title: "Iyun hisobotini tayyorlash", description: "Moliyaviy hisobotni yopish", assignedTo: "emp2", priority: "high", status: "todo", dueDate: "2026-07-01", createdAt: new Date().toISOString() },
  { id: "t3", title: "Yetkazish jadvalini yangilash", description: "Iyul oyi uchun yetkazish jadvalini tuzish", assignedTo: "emp3", priority: "medium", status: "todo", dueDate: "2026-07-03", createdAt: new Date().toISOString() },
  { id: "t4", title: "Yangi mijozlar bilan aloqa", description: "10 ta yangi potentsial mijozga qo'ng'iroq", assignedTo: "emp4", priority: "medium", status: "done", dueDate: "2026-06-30", createdAt: new Date().toISOString() },
];

export const useHRStore = create<HRStore>()(
  persist(
    (set) => ({
      employees: initialEmployees,
      attendance: [],
      salaries: [],
      tasks: initialTasks,

      addEmployee: (e) => set((s) => ({ employees: [...s.employees, { ...e, id: "emp-" + Date.now() }] })),
      updateEmployee: (id, data) => set((s) => ({ employees: s.employees.map((e) => e.id === id ? { ...e, ...data } : e) })),
      deleteEmployee: (id) => set((s) => ({ employees: s.employees.filter((e) => e.id !== id) })),

      markAttendance: (record) => set((s) => ({
        attendance: [
          ...s.attendance.filter((a) => !(a.employeeId === record.employeeId && a.date === record.date)),
          { ...record, id: "att-" + Date.now() },
        ],
      })),
      updateAttendance: (id, data) => set((s) => ({ attendance: s.attendance.map((a) => a.id === id ? { ...a, ...data } : a) })),

      addSalary: (salary) => set((s) => ({ salaries: [...s.salaries, { ...salary, id: "sal-" + Date.now() }] })),
      markSalaryPaid: (id) => set((s) => ({ salaries: s.salaries.map((sal) => sal.id === id ? { ...sal, paid: true, paidDate: today } : sal) })),

      addTask: (t) => set((s) => ({ tasks: [{ ...t, id: "task-" + Date.now(), createdAt: new Date().toISOString() }, ...s.tasks] })),
      updateTaskStatus: (id, status) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, status } : t) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
    }),
    { name: "fmi-hr" }
  )
);
