import { PlusIcon } from "lucide-react";
import Card from "./Card";
import CustomSeperator from "./ui/CustomSeperator";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { Status, Task } from "@/types-env.d";
import TaskModal from "./TaskModal";
import { useAxios } from "@/hooks/axios";

type CardColumnProps = {
	headingColor: string;
	cards: Task[];
	column: Status;
	setCards: Dispatch<SetStateAction<Task[]>>;
};

const CardColumn: React.FC<CardColumnProps> = ({
	headingColor,
	column,
	setCards,
	cards,
}) => {
	const [active, setActive] = useState(false);
	const [dialog, setDialog] = useState(false);

	const axios = useAxios();

	const handleDragStart = (e: React.DragEvent, card: Task) => {
		e.dataTransfer.setData("cardId", card._id);
	};

	const handleDragEnd = (e: React.DragEvent) => {
		const cardId = e.dataTransfer.getData("cardId");

		setActive(false);
		clearHighlights();
		axios.put(`/task/${cardId}`, { status: column });
		// dispatch(updateTask({ _id: cardId, status: column }));

		const { element } = getNearestIndicator(e);

		const before = (element as HTMLElement).dataset.before || "-1";

		let copy = [...cards];

		let cardToTransfer = copy.find((c) => c._id === cardId);
		if (!cardToTransfer) return;
		cardToTransfer = { ...cardToTransfer, status: column };

		copy = copy.filter((c) => c._id !== cardId);

		const moveToBack = before === "-1";

		if (moveToBack) {
			copy.push(cardToTransfer);
		} else {
			const insertAtIndex = copy.findIndex((el) => el._id === before);
			if (insertAtIndex === undefined) return;

			copy.splice(insertAtIndex, 0, cardToTransfer);
		}

		setCards(copy);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		highlightIndicator(e);

		setActive(true);
	};

	const clearHighlights = () => {
		const indicators = document.querySelectorAll(`[data-column="${column}"]`);

		indicators.forEach((i) => {
			(i as HTMLElement).style.opacity = "0";
		});
	};

	const highlightIndicator = (e: React.DragEvent) => {
		clearHighlights();

		const { element } = getNearestIndicator(e);

		if (element) (element as HTMLElement).style.opacity = "1";
	};

	const getNearestIndicator = (e: React.DragEvent) => {
		const DISTANCE_OFFSET = 150;
		const indicators = getIndicators();

		const el = indicators.reduce(
			(closest, child) => {
				const box = child.getBoundingClientRect();

				const offset = e.clientY - (box.top + DISTANCE_OFFSET);

				if (offset < 0 && offset > closest.offset) {
					return { offset: offset, element: child };
				} else {
					return closest;
				}
			},
			{
				offset: Number.NEGATIVE_INFINITY,
				element: indicators[indicators.length-1],
			}
		);

		return el;
	};

	const getIndicators = () => {
		return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
	};

	const handleDragLeave = () => {
		clearHighlights();
		setActive(false);
	};

	const filteredCards = cards.filter((c) => c.status === column);

	return (
		<div className="shrink-0 flex-1 w-full max-w-sm h-full">
			<div className="mb-3 flex text-xl gap-5 items-center">
				<h3 className={`font-medium max-w-fit ${headingColor}`}>{column}</h3>
				<span className="rounded font-semibold tracking-wider text-neutral-400">
					[{filteredCards.length}]
				</span>
			</div>
			<div
				onDrop={handleDragEnd}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				className={`h-full w-full transition-colors ${
					active ? "bg-neutral-800/50" : "bg-neutral-800/0"
				}`}
			>
				{filteredCards.map((c) => {
					return (
						<Card
							key={c._id}
							card={c}
							column={column}
							handleDragStart={handleDragStart}
						/>
					);
				})}
				<CustomSeperator beforeId="-1" column={column} />
				<motion.button
					layout
					onClick={() => setDialog(true)}
					className="text-sm flex w-full items-center gap-1.5 px-1 py-1.5 text-neutral-400 transition-colors hover:text-neutral-50"
				>
					<span>Add Card</span> <PlusIcon className="w-5 h-5 mt-0.5" />
				</motion.button>
				<TaskModal
					isOpen={dialog}
					onClose={() => setDialog(false)}
					task={null}
				/>
			</div>
		</div>
	);
};

export default CardColumn;
