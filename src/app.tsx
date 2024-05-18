import { useEffect, useState } from "react"
import Layout from "@/pages/layout"
import Home from "@/pages/home"
import NoPage from "@/pages/nopage"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Chat from "@/pages/chat"
import AppSettings from "@/pages/app-settings"
import AgentSettings from "@/pages/agent-settings"
import Conversations from "@/pages/conversations"


export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="chat" element={<Chat />} />
                        <Route path="appsettings" element={<AppSettings />} />
                        <Route path="createagent" element={<AgentSettings />} />
                        <Route path="editagent" element={<AgentSettings />} />
                        <Route path="conversations" element={<Conversations />} />
                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}
