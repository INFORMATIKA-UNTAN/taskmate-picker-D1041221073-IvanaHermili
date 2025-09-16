//definisi prioritas + warna + bobot sorting

export const PRIORITY_META = [
    {key:'High', color: '#f15555ff', weight: 3},
    {key:'Medium', color: '#e7f564ff', weight: 2},
    {key:'Low', color: '#a2a4a2ff', weight: 1},
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