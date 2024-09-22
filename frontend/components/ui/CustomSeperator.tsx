import React from "react";
import { cn } from "@/lib/utils";

type CustomSeperatorProps = {
	beforeId: string | null;
	column: string;
	className?: string;
};

const CustomSeperator: React.FC<CustomSeperatorProps> = ({
	beforeId,
	column,
	className,
}) => {
	return (
		<div
			data-before={beforeId || "-1"}
			data-column={column}
			className={cn(
				"my-0.5 h-0.5 bg-muted opacity-0 mx-0 rounded-md bg-purple-400",
				className
			)}
		/>
	);
};

export default CustomSeperator;
