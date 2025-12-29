// rowsCalculator.jsx

export function calculateRowsGeneral(height, width) {
    const baseHeight = 620;
    let baseRows = 6;
    let extraSpace = height - baseHeight;

    if (extraSpace <= 0) return baseRows;

    let rowHeight;
    if (width < 1280) {
        rowHeight = 65;
    } else {
        rowHeight = 69;
    }

    let extraRows = Math.floor(extraSpace / rowHeight);
    if (width >= 1600) {
        extraRows = extraRows - 1;
    }

    return baseRows + extraRows;
}

export function calculateRowsArchive(height, width) {
    const baseHeight = 620;
    let baseRows = 3;
    let extraSpace = height - baseHeight;

    if (extraSpace <= 0) return baseRows;

    let rowHeight = 48.8

    let extraRows = Math.floor(extraSpace / rowHeight);
    if (width >= 1600) {
        extraRows = extraRows - 1;
    }
   

    return baseRows + extraRows ;
}

export function calculateRowsClients(height, width) {
    const baseHeight = 620;
    let baseRows = 6;
    let extraSpace = height - baseHeight;

    if (extraSpace <= 0) return baseRows;

    let rowHeight = 65;

    let extraRows = Math.floor(extraSpace / rowHeight) ;

    if ( width > 1600) {
        extraRows = extraRows - 2;
    }

    return baseRows + extraRows   ;
}

export function calculateRowsHistorique(height,width) {
    const baseHeight = 620;
    let baseRows = 6;
    let extraSpace = height - baseHeight;

    if (extraSpace <= 0) return baseRows;

    let rowHeight = 65;

    let extraRows = Math.floor(extraSpace / rowHeight) ;

    if ( width > 1600) {
        extraRows = extraRows - 2;
    }

    return baseRows + extraRows   ;
}

export function calculateRowsOffres(height) {
    const baseHeight = 620;
    let baseRows = 6;
    let extraSpace = height - baseHeight;

    if (extraSpace <= 0) return baseRows;

    let rowHeight = 69;

    let extraRows = Math.floor(extraSpace / rowHeight) ;

    return baseRows + extraRows -1 ;
}

export function calculateRowsContrats(height) {
    const baseHeight = 620;
    let baseRows = 6;
    let extraSpace = height - baseHeight;

    if (extraSpace <= 0) return baseRows;

    let rowHeight = 64.89;

    let extraRows = Math.floor(extraSpace / rowHeight) ;

    return baseRows + extraRows -1 ;
}
