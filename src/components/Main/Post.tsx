﻿import {
	Avatar,
	Box,
	Button,
	CloseButton,
	Divider,
	Flex,
	Group,
	Image,
	Modal,
	SimpleGrid,
	Text,
	TextInput,
	Title,
	Tooltip,
} from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { FaGlobeAsia, FaTrash } from "react-icons/fa";
import { TbDots, TbShare3 } from "react-icons/tb";
import Havatar from "../Common/Havatar";
import Ftext from "../Footer/Ftext";
import { emojiURLs as emoji } from "../../pages";
import { BiComment, BiEdit, BiLike } from "react-icons/bi";
import { PostType, UserProfileType } from "../../types";
import axios, { AxiosResponse } from "axios";
import useSearchUser from "../../hooks/useSearchUser";
import NavButton from "../Header/NavButton";
import PostMenu from "./PostMenu";
import useTimeAgo from "../../hooks/useTimeAgo";
import AvatarButton from "../Common/AvatarButton";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../Provider/AuthContextProvider";
import useAlert from "../../hooks/useAlert";

type Props = {
	post: PostType;
};
const { VITE_API_URL } = import.meta.env;

function Post({ post }: Props) {
	const { isLoading, isError, userdata } = useSearchUser(post.user_id);
	const [visible, setVisible] = useState(true);
	const timeago = useTimeAgo(post.updatedAt);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const [inEditMode, setInEditMode] = useState(false);
	const [text, setText] = useState(post.text);
	const [updatedText, setUpdateText] = useState("");
	const { token } = useToken();
	const Alert = useAlert();

	const editPost = useCallback(async () => {
		try {
			const { data }: AxiosResponse<PostType> = await axios.patch(
				`${VITE_API_URL}/post/update/${post._id}`,
				{ text },
				{
					headers: { Authorization: token },
				},
			);
			Alert("Post Updated Successfull", "success");
			setInEditMode(false);
			setOpen(false);
			setUpdateText(data.text);
		} catch (error) {
			Alert(String(error), "error");
		}
	}, [token, text, post._id, VITE_API_URL]);

	if (isLoading || !userdata || !visible) {
		return <></>;
	}
	return (
		<Box
			bg={"white"}
			sx={{
				width: "100%",
				borderRadius: "0.5rem",
				overflow: "hidden",
				boxShadow:
					" rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
			}}>
			{/*---:: Head --> Post Info ::---*/}
			<Flex direction={"column"}>
				<Flex justify={"space-between"} p="0.5rem">
					<Flex gap="0.5rem" align={"center"}>
						<Havatar
							onClick={() => navigate(`/${post.user_id}`)}
							src={userdata.image}
							online
							name={userdata.name}
						/>
						<Flex direction={"column"}>
							<Title order={5}>{userdata.name}</Title>
							<Group>
								<Text fz="sm">{timeago}</Text>
								<FaGlobeAsia size={14} />
							</Group>
						</Flex>
					</Flex>

					<Flex align={"center"} gap="0.5rem">
						<Flex pos="relative" align={"center"}>
							<PostMenu
								onView={() => setOpen(true)}
								id={post._id}
								user={post.user_id}
								setVisible={setVisible}
								setInEditMode={setInEditMode}
								setOpen={setOpen}
							/>
						</Flex>

						<CloseButton
							title="Close popover"
							radius={"xl"}
							size="xl"
							iconSize={25}
						/>
					</Flex>
				</Flex>
				<Text p="0 0.5rem">{updatedText === "" ? post.text : updatedText}</Text>
			</Flex>

			{/*---:: Body --> Post Media ::---*/}
			{post.url !== "" && (
				<Box w={"100%"} h="min-content">
					<img
						onClick={() => setOpen(true)}
						style={{
							width: "100%",
							maxHeight: "500px",
							height: "100%",
							objectFit: "contain",
						}}
						src={post.url}
						alt={userdata.name}
					/>
					<Modal
						title={
							<div>
								<AvatarButton src={userdata.image} name={userdata.name} />
								<Group>
									<TextInput
										p="0 0.5rem"
										size="md"
										onChange={(e) => setText(e.target.value)}
										readOnly={!inEditMode}
										value={text}
										variant={inEditMode ? "filled" : "unstyled"}
									/>
									{inEditMode && <Button onClick={editPost}>Done</Button>}
								</Group>
							</div>
						}
						opened={open}
						onClose={() => {
							setOpen(false);
							if (inEditMode) {
								setInEditMode(false);
							}
						}}
						size="xl"
						transitionProps={{ transition: "fade", duration: 200 }}>
						<img
							style={{
								width: "100%",
								height: "100%",
								objectFit: "contain",
							}}
							src={post.url}
							alt="Preview"
						/>
					</Modal>
				</Box>
			)}

			{/*---:: Footer --> Likes - Comments - Share ::---*/}
			<Flex direction={"column"} p="0.5rem" bg="white">
				<Flex justify={"space-between"} p="0.5rem">
					<Group spacing={5}>
						<Tooltip.Group openDelay={300} closeDelay={100}>
							<Avatar.Group spacing={5}>
								<Tooltip label="Salazar Troop" withArrow>
									<Avatar size={"sm"} src={emoji.haha} radius="xl" />
								</Tooltip>
								<Tooltip label="Bandit Crimes" withArrow>
									<Avatar size={"sm"} src={emoji.like} radius="xl" />
								</Tooltip>
								<Tooltip label="Jane Rata" withArrow>
									<Avatar size={"sm"} src={emoji.wow} radius="xl" />
								</Tooltip>
							</Avatar.Group>
						</Tooltip.Group>
						<Text>You and 250 others</Text>
					</Group>
					<Text>{post.comments.length} comments</Text>
				</Flex>
				<Divider />
				<SimpleGrid cols={3}>
					<Button
						variant={"subtle"}
						color="gray"
						size={"md"}
						leftIcon={<BiLike size={22} />}>
						Like
					</Button>
					<Button
						size={"md"}
						variant={"subtle"}
						color="gray"
						leftIcon={<BiComment size={20} />}>
						Comment
					</Button>
					<Button
						variant={"subtle"}
						color="gray"
						size={"md"}
						leftIcon={<TbShare3 size={22} />}>
						Share
					</Button>
				</SimpleGrid>
			</Flex>
		</Box>
	);
}

export default Post;
