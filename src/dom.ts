const scrollToId = (hash: string, offset: number) => {
    const element = document.getElementById(hash);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    }
};

export {scrollToId}
