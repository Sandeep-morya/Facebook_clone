﻿import { Box, Flex } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { getUserInfo } from "../api/user";
import Navbar from "../components/Header/Navbar";
import Post from "../components/Main/Post";
import Photos from "../components/Profile/Photos";
import ProfilePresentation from "../components/Profile/ProfilePresentation";
import useGetCookie from "../hooks/useGetCookie";
import { UserProfileType } from "../types";

type Props = {};

function ProfilePage({}: Props) {
	const token = useGetCookie()("fb_user");
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [userdata, setUserdata] = useState<UserProfileType>();

	const getUser = useCallback(async () => {
		try {
			setIsLoading(true);
			const data = await getUserInfo(token || "");
			setUserdata(data);
			setIsLoading(false);
		} catch (error) {
			setIsError(true);
			setIsLoading(false);
		}
	}, [token, getUserInfo]);

	useEffect(() => {
		getUser();
	}, []);

	useEffect(() => {
		window.document.title = `Facebook - ${userdata?.name}` || "Facebook";
	}, [userdata]);

	if (isLoading || !userdata) {
		return <>Loading....</>;
	}
	return (
		<Flex w={"100%"} mih="100vh" direction={"column"} bg="#F0F2F5">
			<Box w={"100%"} sx={{ position: "sticky", zIndex: 100, top: "0" }}>
				<Navbar user={userdata} unActive />
			</Box>

			<Box
				w={"100%"}
				bg="white"
				h={{
					xs: "40vh",
					sm: "40vh",
					md: "40vh",
					lg: "90vh",
					xl: "70vh",
				}}
				sx={{ boxShadow: "rgba(0, 0, 0, 0.5) 0px 15px 20px -20px" }}
				p={"0 15%"}>
				<ProfilePresentation user={userdata} />
			</Box>

			<Flex gap="1rem" p={"0 18%"} mt="1rem" mb="3rem" pos={"sticky"} top="10%">
				<Flex w="40%" h="100vh" direction="column">
					<Photos />
				</Flex>
				<Flex w="60%" h="100vh" gap="1rem" direction="column">
					<Post />
					<Post />
					<Post />
					<Post />
				</Flex>
			</Flex>
		</Flex>
	);
}

export default ProfilePage;