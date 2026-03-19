export type CrosswordPuzzle = {
	authors: string[];
	editor?: string;
	date: string;
	size: {
		rows: number;
		columns: number;
	};
	grid: CrosswordGrid;
	clues: {
		across: CrosswordClue[];
		down: CrosswordClue[];
	};
};

export type CrosswordCell =
	| null // black cell
	| {
			solution: string;
			value?: string; // user input
	  };

export type CrosswordGrid = CrosswordCell[][];

export type CrosswordClue = {
	number: number;
	row: number;
	column: number;
	length: number;
	text: string;
};



export type NycCrossword = {
	body: NycBody[];
	constructors: string[];
	editor?: string;
	copyright: string;
	id: number;
	lastUpdated: string;
	publicationDate: string;
	subcategory: number;
};

export type NycBody = {
	board: string; // board SVG
	cells: NycCell[];
	clueLists: NycClueList[];
	clues: NycClue[];
	dimensions: {
		width: number;
		height: number;
	};
	SVG: NycSvg;
};

export type NycCell = {
	answer: string;
	clues: [
		number, // across
		number // down
	];
	label?: string;
	type: number; // i don't know what this does
};

export type NycClueList = {
	clues: number[];
	name: 'Across' | 'Down';
};

export type NycClue = {
	cells: number[];
	direction: 'Across' | 'Down';
	label: string;
	list?: number; // i don't know what this does
	text: {
		plain: string;
	}[];
};

export type NycSvg = {
	name: string;
	attributes: {
		name: string;
		value: string;
	}[];
	styles?: {
		name: string;
		value: string;
	}[];
	content?: string;
	children?: NycSvg[];
};
