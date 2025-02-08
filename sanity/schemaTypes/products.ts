import { defineType } from "sanity";

export default defineType({
    name: 'products',
    title: 'Products',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'Product Slug',
            options: {
                source: 'name',
            },
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
        },
        {
            name: "category",
            title: "Category",
            type: 'string',
            options: {
                list: [
                    { title: 'T-Shirt', value: 'tshirt' },
                    { title: 'Short', value: 'short' },
                    { title: 'Jeans', value: 'jeans' },
                    { title: 'Hoodie', value: 'hoodie' },
                    { title: 'Shirt', value: 'shirt' },
                ]
            }
        },
        {
            name: "tags",
            title: "Tags",
            type: 'string',
            options: {
                list: [
                    { title: 'NewArrivals', value: 'newarrivals' },
                    { title: 'TopSelling', value: 'topselling' },
                    { title: 'BestSelling', value: 'bestselling' },
                ]
            }
        },
        {
            name: "status",
            title: "Status",
            type: 'string',
            options: {
                list: [
                    { title: 'Published', value: 'Published' },
                    { title: 'Draft', value: 'Draft' },
                    { title: 'Archieved', value: 'Archieved' },
                ]
            }
        },
        {
            name: "discountPercent",
            title: "Discount Percent",
            type: 'number',
        },
        {
            name: "new",
            type: 'boolean',
            title: "New",
        },
        {
            name: "colors",
            title: "Colors",
            type: 'array',
            of: [
                { type: 'string' }
            ]
        },
        {
            name: "sizes",
            title: "Sizes",
            type: 'array',
            of: [
                { type: 'string' }
            ]
        },
        {
            name: "stock",
            title: "Stock",
            type: 'number',
        },
        {
            name: "sku",
            title: "SKU",
            type: 'number',
        },
       
    ],
});
