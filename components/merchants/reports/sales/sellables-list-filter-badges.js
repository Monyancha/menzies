import { ActionIcon, Badge } from "@mantine/core";
import { IconX } from "@tabler/icons";
import { useRouter } from "next/router";

function SellablesListFilterBadges({ pageUrl }) {
  return (
    <div className="w-full mt-2 flex flex-wrap gap-2">
      <CategoryFilterBadge pageUrl={pageUrl} />
      <SubCategoryFilterBadge pageUrl={pageUrl} />
    </div>
  );
}

const CategoryFilterBadge = ({ pageUrl }) => {
  const router = useRouter();
  const category_id = router?.query?.category_id;
  const category_name = router?.query?.category_name;

  const params = new URLSearchParams(router.query);
  params.delete("category_id");
  params.delete("category_name");
  let qStr = params.toString();
  qStr = qStr ? `?${qStr}` : "";

  const path = `${pageUrl}${qStr}`;

  function removeAction() {
    router.push(path, "", { scroll: false });
  }

  const removeButton = (
    <ActionIcon variant="subtle" color="red" radius="lg" onClick={removeAction}>
      <IconX size={16} />
    </ActionIcon>
  );

  return (
    category_id &&
    category_name && (
      <Badge rightSection={removeButton}>Category: {category_name}</Badge>
    )
  );
};

const SubCategoryFilterBadge = ({ pageUrl }) => {
  const router = useRouter();
  const sub_category_id = router?.query?.sub_category_id;
  const sub_category_name = router?.query?.sub_category_name;

  const params = new URLSearchParams(router.query);
  params.delete("sub_category_id");
  params.delete("sub_category_name");
  let qStr = params.toString();
  qStr = qStr ? `?${qStr}` : "";

  const path = `${pageUrl}${qStr}`;

  function removeAction() {
    router.push(path, "", { scroll: false });
  }

  const removeButton = (
    <ActionIcon variant="subtle" color="red" radius="lg" onClick={removeAction}>
      <IconX size={16} />
    </ActionIcon>
  );

  return (
    sub_category_id &&
    sub_category_name && (
      <Badge rightSection={removeButton} color="grape">
        Sub Category: {sub_category_name}
      </Badge>
    )
  );
};

export default SellablesListFilterBadges;
