import Link from "next/link";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export default function CreateLinkButton({
  href = null,
  withIcon = true,
  variant = "outline",
  text = "Create",
} = {}) {
  return (
    <Link href={href}>
      <div>
        {withIcon && (
          <Button size="xs" variant={variant}  leftIcon={<IconPlus size={16} />}>
            {text}
          </Button>
        )}

        {!withIcon && (
          <Button size="xs" variant="outline">
            {text}
          </Button>
        )}
      </div>
    </Link>
  );
}
