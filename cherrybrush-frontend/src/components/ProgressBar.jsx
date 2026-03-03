function ProgressBar({ steps, totalSteps }) {

    const current_progress = ((steps - 1) / (totalSteps - 1) * 100)

    return(
        <>
        <div className="
        w-full
        h-2
        bg-black
        ">
            <div className="
            h-2
            bg-amber-700
            transition-all
            ease-in-out
            duration-1000`
            " style={{width: `${current_progress}%`}}>
            </div>

        </div>

        
        </>
    )
}

export default ProgressBar