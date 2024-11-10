import { test, expect, describe, it, } from "bun:test";
import {  between, where, zip, sliceOutOfIndices, concat_string, normalizeURL} from "@/utils";

test("where returns correct indices for matches", () => {
    const iterable = ["apple", "banana", "apple", "cherry", "apple"];
    const match = "apple";
    const expected = new Uint8Array([0, 2, 4]);

    const result = where(iterable, match);
    expect(result).toEqual(expected);
});

test("where returns empty array if no matches found", () => {
    const iterable = ["apple", "banana", "cherry"];
    const match = "orange";
    const expected = new Uint8Array([]);

    const result = where(iterable, match);
    expect(result).toEqual(expected);
});

test("between returns correct sub-iterables between matching indices", () => {
    const iterable = ["apple", "banana", "apple", "cherry", "apple", "date"];
    const indices = new Uint8Array([0, 2, 4]);
    const result = between(iterable, indices);

    const subArrays = [...result].map((subIterable) => [...subIterable]);
    const expected = [["banana"], ["cherry"]];

    expect(subArrays).toEqual(expected);
});
test("between returns multiple correct sub-iterables using indices from where function", () => {
    const iterable = [
        "Good morning",
        "We will discuss ...",
        "\n\n", // index 2, determined by where
        "Hello ...",
        "My first question is",
        "\n\n", // index 5, determined by where
        "Goodbye",
    ];

    // where function returns indices of "\n\n" markers
    const indices = where(iterable, "\n\n"); // expected to return [2, 5]
    const result = between(iterable, indices);

    const subArrays = [...result].map((subIterable) => [...subIterable]);
    const expected = [
        ["Hello ...", "My first question is"], // between 2 and 5
    ];
    expect(subArrays).toEqual(expected);
});

test("sliceOutOfIndices", () => {
    const iterable = [
        "Good morning",
        "We will discuss ...",
        "\n\n",
        "Hello ...",
        "My first question is",
        "\n\n",
        "Goodbye",
    ];

    const indices = where(iterable, "\n\n");
  
    const result = sliceOutOfIndices(iterable, indices);

    const subArrays = [...result].map((subIterable) => [...subIterable]);
    const expected = [
        ["Good morning", "We will discuss ..."],
        ["Hello ...", "My first question is"], // between 2 and 5
        ["Goodbye"],
    ];
    expect(subArrays).toEqual(expected);
});

test("between returns empty sub-iterables if no elements between indices", () => {
    const iterable = ["apple", "apple", "apple"];
    const indices = new Uint8Array([0, 1, 2]);
    const result = between(iterable, indices);

    const subArrays = [...result].map((subIterable) => [...subIterable]);
    const expected  = [[], []];

    expect(subArrays).toEqual(expected);
});

test("between handles case where there is only one match", () => {
    const iterable = ["apple", "banana", "cherry"];
    const indices = new Uint8Array([0]);
    const result = between(iterable, indices);

    const subArrays = [...result].map((subIterable) => [...subIterable]);
    const expected: [] = [];

    expect(subArrays).toEqual(expected);
});

test("zip", () => {
    const a = ["a", "b", "c"];
    const b = [1, 2, 3];

    expect(zip(a, b)).toEqual([
        ["a", 1],
        ["b", 2],
        ["c", 3],
    ]);
});

test("concat_string", () => {
    const a = "Apple"
    const b = "Pie"
    const between = " "

     
    expect(concat_string(a, b, between)).toEqual(
        "Apple Pie"
    )
})

describe('normalizeURL', () => {
    it('should join baseURL and path with a single slash', () => {
        expect(normalizeURL('https://example.com', 'demo')).toBe('https://example.com/demo');
    });

    it('should handle baseURL ending with a slash', () => {
        expect(normalizeURL('https://example.com/', 'demo')).toBe('https://example.com/demo');
    });

    it('should handle path starting with a slash', () => {
        expect(normalizeURL('https://example.com', '/demo')).toBe('https://example.com/demo');
    });

    it('should handle both baseURL ending and path starting with a slash', () => {
        expect(normalizeURL('https://example.com/', '/demo')).toBe('https://example.com/demo');
    });

    it('should handle an empty baseURL', () => {
        expect(normalizeURL('', '/demo')).toBe('/demo');
    });

    it('should handle an empty path', () => {
        expect(normalizeURL('https://example.com', '')).toBe('https://example.com/');
    });

    it('should handle both baseURL and path as empty', () => {
        expect(normalizeURL('', '')).toBe('');
    });

    it('should handle baseURL with multiple trailing slashes', () => {
        expect(normalizeURL('https://example.com///', 'demo')).toBe('https://example.com/demo');
    });

    it('should handle path with multiple leading slashes', () => {
        expect(normalizeURL('https://example.com', '///demo')).toBe('https://example.com/demo');
    });

    it('should handle both baseURL and path with multiple slashes', () => {
        expect(normalizeURL('https://example.com//', '//demo')).toBe('https://example.com/demo');
    });
});

