'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
    This is required for dynamic routes where you can have edited content, that will unevitably be out of sync because of the client-side cache that <Link/> offers.
    export const dynamic = "force-dynamic" would work for this case, but it's bugged.
    https://github.com/vercel/next.js/issues/42991 - an issue that is open since nov/2022
 **/
export function SetDynamicRoute() {
    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, [router]);

    return <></>;
}
