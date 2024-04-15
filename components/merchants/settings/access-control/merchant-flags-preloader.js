import { fetchMerchantFlags } from "../../../../src/store/access/security-slice";
import store from "../../../../src/store/Store";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

export default function MerchantFlagsPreloader() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    return session?.user?.accessToken;
  }, [session]);

  const flagStatus = useSelector((state) => state.security.merchantFlagsStatus);

  useEffect(() => {
    if (!accessToken || flagStatus !== "idle") {
      return;
    }

    const params = {};
    params["accessToken"] = accessToken;

    store.dispatch(fetchMerchantFlags(params));
  }, [accessToken,flagStatus]);
}
