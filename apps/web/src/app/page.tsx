import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-xl font-bold text-emerald-700">小九建站</span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              登录后台
            </Link>
            <Link
              href="/sites/chunchang"
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              查看春昌官网
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              多站点建站平台
              <span className="block text-emerald-700">
                先把真实业务跑起来
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
              用模板和结构化表单管理企业官网、产品服务、最近动态和留言线索。
              第一阶段先跑通山东春昌食品科技股份有限公司官网，再扩展个人博客。
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sites/chunchang"
                className="rounded-lg bg-emerald-700 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-800"
              >
                查看春昌官网预览
              </Link>
              <Link
                href="/manage/chunchang"
                className="rounded-lg border border-emerald-700 bg-white px-8 py-3 text-base font-medium text-emerald-800 shadow-sm hover:bg-emerald-50"
              >
                查看运营管理台
              </Link>
              <Link
                href="/dashboard/templates"
                className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                模板中心
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              当前产品能力
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <svg
                    className="h-6 w-6 text-emerald-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  企业官网模板
                </h3>
                <p className="text-gray-600">
                  用配置驱动首页、产品服务、合作机会、最近动态和联系方式。
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <svg
                    className="h-6 w-6 text-emerald-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  表单化内容管理
                </h3>
                <p className="text-gray-600">
                  第一阶段不做拖拽，先用清晰表单管理真实业务内容。
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <svg
                    className="h-6 w-6 text-emerald-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  留言获客闭环
                </h3>
                <p className="text-gray-600">
                  访客提交咨询，后台查看线索并标记跟进状态。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} 小九建站。当前为本地 MVP 预览。
        </p>
      </footer>
    </div>
  );
}
