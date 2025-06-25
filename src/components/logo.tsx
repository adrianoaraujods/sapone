import * as React from "react";
import Link from "next/link";

import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";

import { BotIcon } from "lucide-react";

export function Logo() {
  return (
    <Button variant="ghost" asChild>
      <Link href="/">
        <BotIcon />

        <Text size="xl">Sapone</Text>
      </Link>
    </Button>
  );
}
