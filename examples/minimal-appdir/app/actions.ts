"use server";

import { jobs } from "@/utils/queuebase";

export default async function executeServer() {
  await jobs("sayHello").enqueue();
}
