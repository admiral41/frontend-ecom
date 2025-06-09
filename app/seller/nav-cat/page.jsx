"use client";
import { createAndUpdateNavData, deleteNavData, getNavData } from "@/api/api";
import React, { useEffect, useRef, useState } from "react";
// import {
//   getNavData,
//   createNavData,
//   updateNavData,
//   deleteNavData,
// } from "@/api/navService"; // Update path if needed

const NavigationForm = () => {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [categories, setCategories] = useState([
        { name: "", subcategories: [""] },
    ]);

    const [navData, setNavData] = useState([]);
    const [editId, setEditId] = useState(null); // for edit tracking
    const formRef = useRef(null); // scroll to top

    useEffect(() => {
        fetchNavData();
    }, []);

    const fetchNavData = async () => {
        try {
            const res = await getNavData();
            setNavData(res.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch navigation data");
        }
    };

    const handleCategoryChange = (index, field, value) => {
        const updated = [...categories];
        updated[index][field] = value;
        setCategories(updated);
    };

    const handleSubcategoryChange = (catIndex, subIndex, value) => {
        const updated = [...categories];
        updated[catIndex].subcategories[subIndex] = value;
        setCategories(updated);
    };

    const addCategory = () => {
        setCategories([...categories, { name: "", subcategories: [""] }]);
    };

    const addSubcategory = (catIndex) => {
        const updated = [...categories];
        updated[catIndex].subcategories.push("");
        setCategories(updated);
    };

    const resetForm = () => {
        setTitle("");
        setSlug("");
        setCategories([{ name: "", subcategories: [""] }]);
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { title, categories };
        console.log('Submitted data:', JSON.stringify(data, null, 2));

        try {
            if (editId) {
                // await updateNavData(editId, data);
                 await createAndUpdateNavData(data);
                // toast.success("Navigation updated");
            } else {
                await createAndUpdateNavData(data);
                // toast.success("Navigation created");
            }

            fetchNavData();
            resetForm();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleEdit = (item) => {
        setTitle(item.title);
        setSlug(item.slug);
        setCategories(item.categories);
        setEditId(item._id);
        formRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleDelete = async (slug) => {
        try {
              await deleteNavData(slug);
            //   toast.success("Navigation deleted");
            fetchNavData();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="p-8 w-full bg-white rounded-xl shadow-md overflow-x-auto">
            {/* Form */}
            <div ref={formRef}>
                <h2 className="text-lg font-semibold mb-6 text-gray-700">
                    {editId ? "Edit Navigation" : "Navigation Form"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                        {/* <div className="w-full">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Slug
                            </label>
                            <input
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div> */}
                    </div>

                    <div className="space-y-6">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border">Category Name</th>
                                    <th className="px-4 py-2 border">Subcategories</th>
                                    <th className="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, catIndex) => (
                                    <tr key={catIndex} className="border-t">
                                        <td className="p-2 border">
                                            <input
                                                type="text"
                                                value={cat.name}
                                                onChange={(e) =>
                                                    handleCategoryChange(catIndex, "name", e.target.value)
                                                }
                                                className="w-full border border-gray-300 rounded-lg p-1"
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            {cat.subcategories.map((sub, subIndex) => (
                                                <div key={subIndex} className="mb-2">
                                                    <input
                                                        type="text"
                                                        value={sub}
                                                        onChange={(e) =>
                                                            handleSubcategoryChange(
                                                                catIndex,
                                                                subIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-lg p-1"
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addSubcategory(catIndex)}
                                                className="text-blue-600 text-xs hover:underline"
                                            >
                                                + Add Subcategory
                                            </button>
                                        </td>
                                        <td className="p-2 border text-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...categories];
                                                    updated.splice(catIndex, 1);
                                                    setCategories(updated);
                                                }}
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                Remove Category
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button
                            type="button"
                            onClick={addCategory}
                            className="text-green-600 text-sm hover:underline mt-4"
                        >
                            + Add Category
                        </button>
                    </div>

                    <div className="flex justify-between">
                        {editId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {editId ? "Update" : "Submit"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Table of existing navs */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    Existing Navigations
                </h3>
                {navData.length === 0 ? (
                    <p className="text-gray-500">No navigation data found.</p>
                ) : (
                    <table className="min-w-full border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2">Title</th>
                                <th className="border px-3 py-2">Slug</th>
                                <th className="border px-3 py-2">Categories</th>
                                <th className="border px-3 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {navData.map((item) => (
                                <tr key={item._id} className="border-t">
                                    <td className="border px-3 py-2">{item.title}</td>
                                    <td className="border px-3 py-2">{item.slug}</td>
                                    <td className="border px-3 py-2">
                                        {item.categories.map((cat, i) => (
                                            <div key={i} className="mb-1">
                                                <strong>{cat.name}:</strong> {cat.subcategories.join(", ")}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="border px-3 py-2 space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.slug)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default NavigationForm;
