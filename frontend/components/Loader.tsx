import { cn } from '@/lib/utils';
import React from 'react'
import { ImSpinner8 } from "react-icons/im";


const Loader = ({ className }: { className?: string }) => {
	return <ImSpinner8 className={cn("w-auto h-auto animate-spin", className)} />;
};

export default Loader