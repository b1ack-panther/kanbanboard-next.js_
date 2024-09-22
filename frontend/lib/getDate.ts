export const getDate = (timestamp: Date | undefined): string => {
	return timestamp
		? new Intl.DateTimeFormat("en-IN", {
				month: "short",
				day: "numeric",
				year: "numeric",
		  }).format(new Date(timestamp))
		: "";
};
