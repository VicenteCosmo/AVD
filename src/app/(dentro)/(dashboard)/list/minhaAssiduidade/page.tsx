"use client"

import {useState} from "react"

export default function login(){

  const [nome, setnome]=useState('');
  const [email, setemail]=useState('');

  const handleLogin=(e: React.FormEvent)=>{
    e.preventDefault()
  }

}