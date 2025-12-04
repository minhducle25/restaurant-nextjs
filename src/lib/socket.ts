import evnConfig from "@/config";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import { io } from "socket.io-client";

const socket = io(evnConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
        Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`
    }
});

export default socket;