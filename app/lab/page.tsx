import { redirect } from "next/navigation";

export const metadata = { title: "实验室｜杨逸凡" };

export default function LabPage() {
  redirect("/work");
}
