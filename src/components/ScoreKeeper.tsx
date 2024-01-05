import { State } from "@/types";
import {
    Table,
    TableBody,
    TableColumn,
    TableHeader,
    TableRow,
    TableCell,
    getKeyValue,
    Button,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    RadioGroup,
    Radio,
    Autocomplete,
    AutocompleteItem,
    Select,
    SelectItem,
} from "@nextui-org/react";
import { BroadcastChannel } from "broadcast-channel";
import { Dispatch, SetStateAction, useState } from "react";
import { Edit, Loader, Minus, Plus, X } from "react-feather";

function TeamScore({
    team,
    state,
}: {
    team: "homeTeam" | "awayTeam";
    state: State;
}) {
    const score =
        state[team].players.reduce((prev, curr) => prev + curr.goalsCaught, 0) +
        state[team].adjustments.reduce((prev, curr) => prev + curr.value, 0);
    return (
        <div
            className={`w-full flex ${
                team == "awayTeam" ? "flex-row-reverse" : "flex-row"
            } justify-center items-center`}
        >
            <div
                className={`p-4 -z-10 w-full h-full uppercase flex justify-center items-center font-bold ${
                    team == "homeTeam" ? "bg-primary-200" : "bg-secondary-200"
                } ${
                    team == "homeTeam"
                        ? "rounded-l-lg -mr-1"
                        : "rounded-r-lg -ml-1"
                }`}
            >
                {state[team].name}
            </div>
            <div
                className={`p-4 size-20 flex justify-center items-center aspect-square font-mono font-bold text-5xl rounded shadow-lg ${
                    team == "homeTeam"
                        ? "bg-primary-400 text-primary-foreground"
                        : "bg-secondary-400 text-secondary-foreground"
                }`}
            >
                {score}
            </div>
        </div>
    );
}
function TeamPlayers({
    team,
    state: { [team]: tm },
}: {
    team: "homeTeam" | "awayTeam";
    state: State;
}) {
    const columns = [
        {
            key: "name",
            label: "Name",
        },
        {
            key: "goalsCaught",
            label: "Goals Caught",
        },
        {
            key: "goalsThrown",
            label: "Goals Thrown",
        },
        {
            key: "defensivePlays",
            label: "Defensive Plays",
        },
    ];
    return (
        <Table
            classNames={{
                wrapper: "p-2",
                th: "first:rounded-tl-lg first:rounded-b-none last:rounded-tr-lg last:rounded-b-none",
                thead: "[&>tr]:divide-x-1 [&>tr]:divide-content3",
            }}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
            </TableHeader>
            <TableBody items={tm.players}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>
                                {getKeyValue(item, columnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

function AddScore({
    state,
    setter,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
}) {
    const [team, setTeam] = useState<"home" | "away" | null>(null);
    const [thrower, setThrower] = useState("");
    const [catcher, setCatcher] = useState("");
    function NoTeamChosen() {
        return (
            <div className="rounded p-2 flex justify-center items-center text-sm border-4 border-content2 border-dotted">
                No team chosen
            </div>
        );
    }
    return (
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 items-center">
            <p>Choose team:</p>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    radius="sm"
                    onPress={() => setTeam("home")}
                    className={
                        team == "home"
                            ? "border bg-primary-200 border-primary-200 text-primary-900 font-bold"
                            : "border bg-transparent border-primary-500 text-primary-900"
                    }
                >
                    {state.homeTeam.name}
                </Button>
                <Button
                    radius="sm"
                    onPress={() => setTeam("away")}
                    className={
                        team == "away"
                            ? "border bg-secondary-200 border-secondary-200 text-secondary-900 font-bold"
                            : "border bg-transparent border-secondary-500 text-secondary-900"
                    }
                >
                    {state.awayTeam.name}
                </Button>
            </div>
            <p>Select throwing player:</p>
            {team !== null ? (
                <Select
                    placeholder="Throwing player"
                    selectedKeys={[thrower]}
                    onChange={(e) => setThrower(e.target.value)}
                    size="sm"
                >
                    {state[`${team}Team`].players
                        .filter((player) => player.name !== catcher)
                        .map((player) => (
                            <SelectItem key={player.name}>
                                {player.name}
                            </SelectItem>
                        ))}
                </Select>
            ) : (
                <NoTeamChosen />
            )}
            <p>Select catching player:</p>
            {team !== null ? (
                <Select
                    placeholder="Catching player"
                    selectedKeys={[catcher]}
                    onChange={(e) => setCatcher(e.target.value)}
                    size="sm"
                >
                    {state[`${team}Team`].players
                        .filter((player) => player.name !== thrower)
                        .map((player) => (
                            <SelectItem key={player.name}>
                                {player.name}
                            </SelectItem>
                        ))}
                </Select>
            ) : (
                <NoTeamChosen />
            )}
        </div>
    );
}
function DeleteScore({
    state,
    setter,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
}) {
    return <div></div>;
}
function ModifyPlay({
    state,
    setter,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
}) {
    return <div></div>;
}
function AddPlay({
    state,
    setter,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
}) {
    return <div></div>;
}
function ActionButtons({
    state,
    setter,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const actions = [
        {
            key: "a",
            label: "Add Score",
            color: "success",
            icon: <Plus className="w-4" />,
            component: AddScore,
        },
        {
            key: "d",
            label: "Delete Score",
            color: "danger",
            icon: <Minus className="w-4" />,
            component: DeleteScore,
        },
        {
            key: "m",
            label: "Modify Play",
            color: "primary",
            icon: <Edit className="w-4" />,
            component: ModifyPlay,
        },
        {
            key: "p",
            label: "Add Play",
            color: "secondary",
            icon: <Loader className="w-4" />,
            component: AddPlay,
        },
    ] as const;

    const [action, setAction] = useState<(typeof actions)[number]["key"]>("a");

    const handleOpen = (act: typeof action) => {
        setAction(act);
        onOpen();
    };

    const ActionComponent = actions.find((a) => a.key === action)!.component;

    return (
        <>
            <div className="col-span-full grid grid-cols-4 gap-4">
                {actions.map((act) => (
                    <Button
                        radius="sm"
                        variant="flat"
                        color={act.color}
                        startContent={act.icon}
                        onPress={() => handleOpen(act.key)}
                    >
                        {act.label}
                    </Button>
                ))}
            </div>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onClose={onClose}
                classNames={{
                    header: "flex justify-between items-center leading-tight",
                    closeButton: "hidden",
                    footer: "grid grid-cols-1",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                {
                                    actions.find((act) => act.key === action)!
                                        .label
                                }
                                <Button
                                    isIconOnly
                                    radius="full"
                                    onPress={onClose}
                                >
                                    <X className="w-4" />
                                </Button>
                            </ModalHeader>
                            <ModalBody>
                                <ActionComponent
                                    state={state}
                                    setter={setter}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose}>Close</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export function ScoreKeeper({
    bc,
    state,
    setter,
}: {
    bc: BroadcastChannel;
    state: State;
    setter: Dispatch<SetStateAction<State>>;
}) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-serif px-8 py-2 w-full border-2 border-content3 bg-content1 rounded-t-xl text-center">
                ScoreKeeper
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <TeamScore team="homeTeam" state={state} />
                <TeamScore team="awayTeam" state={state} />
                <ActionButtons state={state} setter={setter} />
                <TeamPlayers team="homeTeam" state={state} />
                <TeamPlayers team="awayTeam" state={state} />
            </div>
        </div>
    );
}
