import Link from "next/link";
import { Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

export default function BackButton({ href }) {
  return (
    <Link href={href}>
      <Button
        size="xs"
        variant="outline"
        leftIcon={<IconChevronLeft size={16} />}
      >
        Back
      </Button>
    </Link>
  );
}
