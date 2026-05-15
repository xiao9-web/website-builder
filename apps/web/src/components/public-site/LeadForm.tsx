"use client";

import { FormEvent, useState } from "react";
import { submitPublicLead } from "@/lib/public-site/api";

interface LeadFormProps {
  siteSlug: string;
}

export function LeadForm({ siteSlug }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cooperationType, setCooperationType] = useState("企业采购");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!phone.trim() || !message.trim()) {
      setStatus("error");
      setFeedback("请填写联系电话和咨询内容。");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const result = await submitPublicLead(siteSlug, {
        name,
        phone,
        companyName,
        cooperationType,
        message,
        sourcePage:
          typeof window !== "undefined" ? window.location.pathname : undefined,
      });

      setStatus("success");
      setFeedback(result.message);
      setName("");
      setPhone("");
      setCompanyName("");
      setCooperationType("企业采购");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error ? error.message : "提交失败，请稍后再试。",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">姓名</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            placeholder="怎么称呼您"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">联系电话</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            placeholder="请输入手机号或电话"
            required
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">公司名称</span>
          <input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            placeholder="选填"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">合作类型</span>
          <select
            value={cooperationType}
            onChange={(event) => setCooperationType(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          >
            <option>企业采购</option>
            <option>经销批发</option>
            <option>渠道合作</option>
            <option>产品咨询</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">咨询内容</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-2 min-h-28 w-full rounded-md border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          placeholder="请简单说明采购需求、合作方式或想了解的产品。"
          required
        />
      </label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-emerald-800 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-stone-400 sm:w-auto"
      >
        {status === "submitting" ? "提交中..." : "提交咨询"}
      </button>
      {feedback ? (
        <p
          className={`text-sm ${
            status === "success" ? "text-emerald-800" : "text-red-700"
          }`}
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
