const Loader = ({ className = "" }) => {
    return (
        <div className={`p-4 flex flex-col items-center justify-center ${className}`}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
        </div>
    );
};

export default Loader;
