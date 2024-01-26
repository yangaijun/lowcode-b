export default function EmptyList({ msg = '没有任何数据' }) {
    return <div style={{ height: 40, color: '#ccc', textAlign: 'center', paddingTop: 10 }}>
        {msg}
    </div>
}