"use client"
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const params = useParams();
    const { menu, category, subcategory } = params;

    return (
        <div>
            <h1>Products for:</h1>
            <p>Menu: {menu}</p>
            <p>Category: {category}</p>
            <p>Subcategory: {subcategory}</p>
        </div>
    )
}

export default page
