import { useMemo, useState } from "react";
import { Download, FileText, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";
import ConfirmModal from "../components/ui/ConfirmModal";
import { usePagination } from "../hooks/usePagination";
import { currency } from "../utils/formatters";
import { exportCsv, exportPdf } from "../utils/exporters";

export default function StudentsPage({ students = [], classes = [], selectedClass = "all" }) {
  const [query, setQuery] = useState("");
  const [deleteHref, setDeleteHref] = useState("");
  const [className, setClassName] = useState(selectedClass || "all");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return students.filter((student) => {
      const matchesClass = className === "all" || !className || student.class_name === className;
      const searchable = `${student.name} ${student.roll} ${student.phone} ${student.class_name}`.toLowerCase();
      return matchesClass && (!term || searchable.includes(term));
    });
  }, [students, query, className]);

  const { rows, page, pageCount, setPage } = usePagination(filtered, 8);

  function onClassChange(event) {
    const value = event.target.value;
    setClassName(value);
    const params = new URLSearchParams();
    if (value && value !== "all") params.set("class", value);
    history.replaceState(null, "", `/students${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div className="space-y-5">
      <div className="panel">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input className="field pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students, roll, phone..." />
            </label>
            <select className="field sm:max-w-56" value={className || "all"} onChange={onClassChange} aria-label="Filter by class">
              <option value="all">All Classes</option>
              {classes.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <a className="btn-primary" href="/add-student"><Plus className="h-4 w-4" /> Add</a>
            <button className="btn-ghost" type="button" onClick={() => exportCsv("students.csv", filtered)}><Download className="h-4 w-4" /> Excel</button>
            <button className="btn-ghost" type="button" onClick={exportPdf}><FileText className="h-4 w-4" /> PDF</button>
          </div>
        </div>
      </div>

      {filtered.length ? (
        <section className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="table-head text-xs uppercase tracking-[0.12em]">
                <tr>
                  {["ID", "Name", "Roll", "Class", "Phone", "Total Fee", "Paid", "Due", "Status", "Action"].map((head) => (
                    <th key={head} className="px-4 py-3 font-bold">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 light:divide-slate-200/80">
                {rows.map((student) => {
                  const due = Number(student.total_fee) - Number(student.paid_fee);
                  const paid = due <= 0;
                  return (
                    <tr key={student.id} className="table-row">
                      <td className="px-4 py-3 text-muted">#{student.id}</td>
                      <td className="px-4 py-3 font-bold text-title">{student.name}</td>
                      <td className="px-4 py-3">{student.roll}</td>
                      <td className="px-4 py-3">{student.class_name}</td>
                      <td className="px-4 py-3">{student.phone}</td>
                      <td className="px-4 py-3">{currency(student.total_fee)}</td>
                      <td className="px-4 py-3">{currency(student.paid_fee)}</td>
                      <td className="px-4 py-3 font-bold">{currency(due)}</td>
                      <td className="px-4 py-3">
                        <span className={paid ? "status-success" : "status-danger"}>
                          {paid ? "Paid" : "Due"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <details className="relative">
                          <summary className="btn-ghost inline-flex cursor-pointer list-none p-2" aria-label={`Open actions for ${student.name}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </summary>
                          <div className="menu-surface absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl">
                            <a className="menu-item" href={`/edit-student/${student.id}`}>Edit</a>
                            <a className="menu-item" href={`/pay-monthly-fee/${student.id}`}>Monthly Fee</a>
                            <a className="menu-item" href={`/receipt/${student.id}`} target="_blank" rel="noreferrer">Receipt</a>
                            {!paid ? <a className="menu-item text-emerald-200 light:text-emerald-700" href={`/pay-fee/${student.id}`}>Pay Due</a> : null}
                            <button className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-rose-200 transition duration-200 hover:bg-rose-300/10 hover:text-rose-100 light:text-rose-700 light:hover:text-rose-800" type="button" onClick={() => setDeleteHref(`/delete-student/${student.id}`)}>
                              <Trash2 className="h-4 w-4" /> Delete
                            </button>
                          </div>
                        </details>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 light:border-slate-200/80 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">Showing {rows.length} of {filtered.length} students</p>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:flex">
              <button className="btn-ghost" type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span className="grid min-w-16 place-items-center text-sm font-bold text-soft">{page} / {pageCount}</span>
              <button className="btn-ghost" type="button" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        </section>
      ) : (
        <EmptyState title="No students found" description="Add a student or clear your search and class filters." />
      )}

      <ConfirmModal
        open={Boolean(deleteHref)}
        title="Delete student?"
        description="This keeps the existing backend delete route and asks for confirmation before navigating."
        confirmHref={deleteHref}
        onClose={() => setDeleteHref("")}
      />
    </div>
  );
}
