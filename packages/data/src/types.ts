export interface Attributes {
    durability: number;
    cannon: number;
    torpedo: number;
    antiaircraft: number;
    air: number;
    reload: number;
    hit: number;
    dodge: number;
    speed: number;
    luck: number;
    antisub: number;
}

export enum Armor {
    Light = 1,
    Medium = 2,
    Heavy = 3,
}

export enum Nationality {
    Universal = 0,
    EagleUnion = 1,
    RoyalNavy = 2,
    SakuraEmpire = 3,
    IronBlood = 4,
    DragonEmpery = 5,
    SardegnaEmpire = 6,
    NorthernParliament = 7,
    IrisLibre = 8,
    VichyaDominion = 9,
    IrisOrthodoxy = 10,
    KindomOfTulipa = 11,
    Tempesta = 96,
    META = 97,
    Neptunia = 101,
    Bilibili = 102,
    Utawarerumono = 103,
    KizunaAI = 104,
    Hololive = 105,
    VenusVacation = 106,
    TheIdolmaster = 107,
    SSSS = 108,
    AtelierRyza = 109,
    SenranKagura = 110,
    ToLoveRu = 111,
    BlackRockShooter = 112,
}

export enum ShipType {
    Destroyer = 1,
    LightCruiser = 2,
    HeavyCruiser = 3,
    BattleCruiser = 4,
    Battleship = 5,
    LightAircraftCarrier = 6,
    AircraftCarrier = 7,
    Submarine = 8,
    AviationBattleship = 10,
    RepairShip = 12,
    Monitor = 13,
    SubmarineCarrier = 17,
    LargeCruiser = 18,
    MunitionShip = 19,
    GuidedMissileDestroyerVanguard = 20,
    GuidedMissileDestroyerMain = 21,
    SailingFrigateSubmarine = 22,
    SailingFrigateVanguard = 23,
    SailingFrigateMain = 24,
}

export enum EquipType {
    DDGun = 1,
    CLGun = 2,
    CAGun = 3,
    BBGun = 4,
    Torpedo = 5,
    AAGun = 6,
    Fighter = 7,
    TorpedoBomber = 8,
    DiveBomber = 9,
    Auxiliary = 10,
    CBGun = 11,
    Seaplane = 12,
    SubmarineTorpedo = 13,
    AntisubAuxiliary = 14,
    AntisubBomber = 15,
    Helicopter = 17,
    Cargo = 18,
    GuidedMissile = 20,
    AATimeFuzeGun = 21,
}
