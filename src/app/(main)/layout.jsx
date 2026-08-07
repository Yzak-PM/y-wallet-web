import NavMain from "@/components/layout/nav-main";

export default function MainLayout({ children }) {
  return (
    <main className="min-h-screen py-3 px-6">
      <div className="mx-auto flex flex-col">
        <NavMain />
        <hr className="mt-2 text-gray-300" />

        <div className="mt-3 mb-5">{children}</div>
      </div>
    </main>
  );
}
