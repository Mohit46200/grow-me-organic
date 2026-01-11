import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useState, useEffect } from 'react'

interface Api {
    id: number
    title: string
    place_of_origin: string
    artist_title: string
    inscriptions: string
    date_start: number
    date_end: number
}

interface Table {
    id: number
    title: string
    place: string
    artist: string
    inscription: string
    start: number
    end: number
}

function App() {
    const [data, setData] = useState<Table[]>([])
    const [page, setPage] = useState(1)
    const [selectedRows, setSelectedRows] = useState<Table[]>([])
    const [text, setText] = useState('')
    const limit = 20

    useEffect(() => {
        fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`)
            .then(res => res.json())
            .then((response: { data: Api[] }) => {
                const mapped = response.data.map(item => ({
                    id: item.id,
                    title: item.title,
                    place: item.place_of_origin,
                    artist: item.artist_title,
                    inscription: item.inscriptions,
                    start: item.date_start,
                    end: item.date_end
                }));
                setData(mapped)
            })
    }, [page])

    const titleHeader = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
                type="number"
                placeholder="Rows"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ height: '2rem', padding: '0 0.5rem' }}
            />
            <button
                style={{ height: '2rem', padding: '0 0.75rem' }}
                onClick={() => {
                    const num = parseInt(text, 10)
                    if (isNaN(num) || num <= 0) return

                    const newRows = data.slice(0, num)
                    const merged = [
                        ...selectedRows,
                        ...newRows.filter(
                            row => !selectedRows.some(r => r.id === row.id)
                        )
                    ];
                    setSelectedRows(merged)
                }}
            >
                Submit
            </button>
        </div>
    );

    return (
        <>
            {/* Selection summary (like screenshot) */}
            <div
                style={{
                    marginBottom: '0.75rem',
                    fontSize: '0.9rem',
                    color: '#FFFFFF'
                }}
            >
                <strong>Selected:</strong> {selectedRows.length} rows
            </div>

            <DataTable
                value={data}
                dataKey="id"
                selection={selectedRows}
                onSelectionChange={(e) => setSelectedRows(e.value)}
                tableStyle={{ minWidth: '60rem' }}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="title" header={titleHeader} />
                <Column field="place" header="Place of origin" />
                <Column field="artist" header="Artist" />
                <Column field="inscription" header="Inscription" />
                <Column field="start" header="Start date" />
                <Column field="end" header="End date" />
            </DataTable>

            {/* Centered pagination */}
            <div
                style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem'
                }}
            >
                <button onClick={() => setPage(p => Math.max(p - 1, 1))}>
                    Previous
                </button>
                <button onClick={() => setPage(p => p + 1)}>
                    Next
                </button>
            </div>
        </>
    )
}

export default App
