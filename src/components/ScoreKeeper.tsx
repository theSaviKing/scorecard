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
    Select,
    SelectItem,
    ScrollShadow,
    Divider,
    Spinner,
} from "@nextui-org/react";
import { BroadcastChannel } from "broadcast-channel";
import { produce } from "immer";
import { Dispatch, SetStateAction, useState } from "react";
import { Award, Edit, Loader, Minus, Plus, Trash, X } from "react-feather";
import { useSessionStorage } from "usehooks-ts";
import { useAsyncList } from "@react-stately/data";

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
    state: {
        [team]: { players },
    },
}: {
    team: "homeTeam" | "awayTeam";
    state: State;
}) {
    const [isLoading, setLoading] = useState(true);
    const columns = [
        {
            key: "isCaptain",
            label: "",
        },
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
    let list = useAsyncList({
        load: () => {
            setLoading(false);
            return { items: players };
        },
        sort: async ({ items, sortDescriptor }) => ({
            items: items.sort((a, b) => {
                let first = a[sortDescriptor.column];
                let second = b[sortDescriptor.column];
                let cmp =
                    (parseInt(first) || first) < (parseInt(second) || second)
                        ? -1
                        : 1;

                if (sortDescriptor.direction === "descending") {
                    cmp *= -1;
                }

                return cmp;
            }),
        }),
    });
    return (
        <Table
            classNames={{
                wrapper: "p-2",
                th: "first:rounded-tl-lg first:rounded-b-none last:rounded-tr-lg last:rounded-b-none",
                thead: "[&>tr]:divide-x-1 [&>tr]:divide-content3",
            }}
            isStriped
            selectionMode="single"
            color={team == "homeTeam" ? "primary" : "secondary"}
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.key} allowsSorting align="center">
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                items={list.items}
                isLoading={isLoading}
                loadingContent={
                    <Spinner
                        color={team == "homeTeam" ? "primary" : "secondary"}
                    />
                }
            >
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>
                                {columnKey === "isCaptain" && item.isCaptain ? (
                                    <Award className="w-3 opacity-80" />
                                ) : (
                                    getKeyValue(item, columnKey)
                                )}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

type Play =
    | {
          team: "home" | "away";
          thrower: string;
          catcher: string;
      }
    | { team: "home" | "away"; defender: string };
function AddScore({
    state,
    setter,
    onClose,
    plays,
    setPlays,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
    onClose: () => void;
    plays: Play[];
    setPlays: Dispatch<SetStateAction<Play[]>>;
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
                    onPress={() => {
                        setTeam("home");
                        setThrower("");
                        setCatcher("");
                    }}
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
                    onPress={() => {
                        setTeam("away");
                        setThrower("");
                        setCatcher("");
                    }}
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
                        .filter((player) => player.id !== catcher)
                        .map((player) => (
                            <SelectItem key={player.id} value={player.id}>
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
                        .filter((player) => player.id !== thrower)
                        .map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                                {player.name}
                            </SelectItem>
                        ))}
                </Select>
            ) : (
                <NoTeamChosen />
            )}
            {thrower && catcher && (
                <p
                    className={`col-span-full p-4 rounded-sm border-2 border-content2 text-center [&>span]:font-bold ${
                        team == "home"
                            ? "[&>span]:text-primary"
                            : "[&>span]:text-secondary"
                    }`}
                >
                    <span>
                        {
                            state[`${team!}Team`].players.find(
                                (p) => p.id === thrower
                            )?.name
                        }
                    </span>{" "}
                    throws to{" "}
                    <span>
                        {
                            state[`${team!}Team`].players.find(
                                (p) => p.id === catcher
                            )?.name
                        }
                    </span>{" "}
                    for a point!
                </p>
            )}
            <Button
                className="col-span-full"
                color="success"
                variant="flat"
                isDisabled={!(team && thrower && catcher)}
                onPress={(_) => {
                    setter((st) =>
                        produce(st, (draft) => {
                            draft[`${team!}Team`].players.find(
                                (p) => p.id === thrower
                            )!.goalsThrown += 1;
                            draft[`${team!}Team`].players.find(
                                (p) => p.id === catcher
                            )!.goalsCaught += 1;
                        })
                    );
                    setPlays(function (st) {
                        return st.concat({
                            team: team!,
                            thrower: thrower,
                            catcher: catcher,
                        });
                    });
                    onClose();
                }}
            >
                Submit
            </Button>
        </div>
    );
}
function DeleteScore({
    state,
    setter,
    onClose,
    plays,
    setPlays,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
    onClose: () => void;
    plays: Play[];
    setPlays: Dispatch<SetStateAction<Play[]>>;
}) {
    return (
        <div className="flex flex-col gap-4">
            <p className="p-2 border-2 border-content2 rounded text-center inline-flex justify-center items-center gap-1">
                Hover and click <Trash className="inline w-4" /> to delete a
                play
            </p>
            <Divider />
            <ScrollShadow className="max-h-60 flex flex-col gap-2">
                {plays.length > 0 ? (
                    plays.map((play, index) => (
                        <div
                            className={`border rounded grid group transition-all grid-cols-[0fr,6fr] hover:grid-cols-[1fr,6fr] grid-rows-[1fr,1.55fr] ${
                                play.team == "home"
                                    ? "border-primary-100 bg-primary-200 text-primary-900"
                                    : "border-secondary-100 bg-secondary-200 text-secondary-900"
                            }`}
                            key={index}
                        >
                            <div
                                className={`row-span-full w-0 group-hover:w-full transition-all overflow-hidden`}
                            >
                                <div className="flex justify-center items-center w-full h-full">
                                    <Button
                                        isIconOnly
                                        startContent={<Trash />}
                                        variant="flat"
                                        color="danger"
                                        radius="sm"
                                        onPress={() => {
                                            setPlays((plays) =>
                                                produce(plays, (draft) => {
                                                    draft.splice(index, 1);
                                                })
                                            );
                                            setter((st) =>
                                                produce(st, (draft) => {
                                                    if (play.defender) {
                                                        draft[
                                                            `${play.team}Team`
                                                        ].players.find(
                                                            (pl) =>
                                                                pl.id ===
                                                                play.defender
                                                        )!.defensivePlays -= 1;
                                                    } else {
                                                        draft[
                                                            `${play.team}Team`
                                                        ].players.find(
                                                            (pl) =>
                                                                pl.id ===
                                                                play.thrower
                                                        )!.goalsThrown -= 1;
                                                        draft[
                                                            `${play.team}Team`
                                                        ].players.find(
                                                            (pl) =>
                                                                pl.id ===
                                                                play.catcher
                                                        )!.goalsCaught -= 1;
                                                    }
                                                })
                                            );
                                        }}
                                    ></Button>
                                </div>
                            </div>
                            <p
                                className={`text-center text-sm font-bold p-2 ${
                                    play.team == "home"
                                        ? "bg-primary-100 text-primary-900"
                                        : "bg-secondary-100 text-secondary-900"
                                }`}
                            >
                                {play.defender
                                    ? "DEFENSIVE PLAY"
                                    : "GOAL SCORED"}
                            </p>
                            <div className="p-2 text-center flex justify-center items-center row-span-2">
                                <p>
                                    {play.defender ? (
                                        <>
                                            defense by{" "}
                                            <span className="font-bold">
                                                {
                                                    state[
                                                        `${play.team}Team`
                                                    ].players.find(
                                                        (p) =>
                                                            p.id ===
                                                            play.defender
                                                    )!.name
                                                }
                                            </span>{" "}
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-bold">
                                                {
                                                    state[
                                                        `${play.team}Team`
                                                    ].players.find(
                                                        (p) =>
                                                            p.id ===
                                                            play.thrower
                                                    )!.name
                                                }
                                            </span>{" "}
                                            throws to{" "}
                                            <span className="font-bold">
                                                {
                                                    state[
                                                        `${play.team}Team`
                                                    ].players.find(
                                                        (p) =>
                                                            p.id ===
                                                            play.catcher
                                                    )!.name
                                                }
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 bg-content2 rounded flex justify-center items-center">
                        No scores yet
                    </div>
                )}
            </ScrollShadow>
        </div>
    );
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
    const [plays, setPlays] = useSessionStorage<Play[]>("plays", []);

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
                        key={act.key}
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
                                    onClose={onClose}
                                    plays={plays}
                                    setPlays={setPlays}
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
