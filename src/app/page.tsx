import React from 'react'

export default async function page() {
  const res= await fetch('https://api.github.com/users/defunkt');
  const dado= await res.json();
  return (
    <div>{dado.name}</div>
  )
}
