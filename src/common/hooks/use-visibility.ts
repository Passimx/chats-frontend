const useVisibility = (visibilityClass: string, hiddenClass: string, isVisible?: boolean): string =>
    isVisible !== undefined ? (isVisible ? visibilityClass : hiddenClass) : '';

export default useVisibility;
