//definisi prioritas + warna + bobot sorting

export const PRIORITY_META = [
    {key:'High', color: '#f15555ff', weight: 3},
    {key:'Medium', color: '#f5cc64ff', weight: 2},
    {key:'Low', color: '#a5f66cff', weight: 1},
];

//daftar label (untuk picker/chip)
export const PRIORITIES = PRIORITY_META.map(p => p.key);

//ambil warna prioritas
export function colorOfPriority(name){
    const f = PRIORITY_META.find(p => p.key === name);
    return f ? f.color : '#64748b';
}

//ambil bobot untuk sorting (high > medium > low)
export function weightOfPriority(name){
    const f = PRIORITY_META.find(p => p.key === name);
    return f ? f.weight : 1;
}