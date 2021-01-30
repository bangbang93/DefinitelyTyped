import {ObjectId} from 'mongodb'
import * as session from 'express-session'

declare module 'nodebb/src/database' {
    interface IScan {
        match: string
    }
    interface IRawObject {
        _key: unknown
        [key: string]: unknown
    }

    type TField = string

    interface IDatabaseMain<TKey extends TField = string> {
        flushdb(): Promise<void>
        emptydb(): Promise<void>
        exists(key: TKey): Promise<boolean>
        exists(key: TKey[]): Promise<boolean[]>
        scan(params: IScan): Promise<IRawObject[]>
        delete(key: TKey): Promise<void>
        deleteAll(keys: TKey[]): Promise<void>
        get<R = unknown>(key: TKey): Promise<R>
        set(key: TKey, value: unknown): Promise<void>
        increment(key: TKey): Promise<unknown>
        rename(oKey: TKey, nkey: TKey): Promise<void>
        type(key: TKey): Promise<void>
        expire(key: TKey, seconds: number): Promise<void>
        expireAt(key: TKey, ts: number): Promise<void>
        pexpire(key: TKey, ms: number): Promise<void>
        pexpireAt(key: TKey, ts: number): Promise<void>
        ttl(key: TKey): Promise<number>
        pttl(key: TKey): Promise<number>
    }

    interface IDatabaseHash<TKey extends TField = string> {
        setObject(key: TKey | TKey[], data: unknown): Promise<void>
        setObjectField(key: TKey, field: string, data: unknown): Promise<void>
        getObject<R = unknown>(key: TKey): Promise<R>
        getObjects<R extends unknown[] = unknown[]>(keys: TKey[]): Promise<[...R]>
        getObjectField<R>(key: TKey, field: string): Promise<R>
        getObjectFields<R = Record<TKey, unknown>>(key: TKey, fields: string[]): Promise<R>
        getObjectsFields<R extends unknown[] = Record<string, unknown>[]>(keys: TKey[], fields: string[]): Promise<[...R]>
        getObjectKeys(key: TKey): Promise<TField[]>
        getObjectValues(key: TKey): Promise<unknown[]>
        isObjectField(key: TKey, field: TField): Promise<boolean>
        isObjectFields(key: TKey, fields: TField[]): Promise<boolean[]>
        deleteObjectField(key: TKey, field: TField): Promise<void>
        deleteObjectFields(key: TKey, fields: TField[]): Promise<void>
        incrObjectField(key: TKey, field: TField): Promise<number>
        incrObjectField(key: TKey[], field: TField): Promise<number[]>
        decrObjectField(key: TKey, field: TField): Promise<number>
        decrObjectField(key: TKey[], field: TField): Promise<number[]>
        incrObjectFieldBy(key: TKey, field: TField, value: number): Promise<number>
        incrObjectFieldBy(key: TKey[], field: TField, value: number): Promise<number[]>
    }

    interface IDatabaseHelper<TKey extends TField = string> {
        noop(): void
        toMap(data: IRawObject): Record<string, unknown>
        fieldToString(field: unknown): string
        serializeData(data: unknown): Record<string, unknown>
        deserializeData(data: unknown): Record<string, unknown>
        valueToString(value: unknown): string
        buildMatchQuery(match: string): string
    }

    interface IDatabaseSet<TKey extends TField = string> {
        setAdd(key: TKey, value: unknown | unknown[]): Promise<void>
        setsAdd(keys: TKey[], value: unknown | unknown[]): Promise<void>
        setRemove(key: TKey, value: unknown| unknown[]): Promise<void>
        setsRemove(keys: TKey[], value: unknown | unknown[]): Promise<void>
        isSetMember(key: TKey, value: unknown): Promise<void>
        isSetMembers(key: TKey, values: unknown[]): Promise<void>
        isMemberOfSets(keys: TKey[], values: unknown): Promise<boolean[]>
        getSetMembers<R extends unknown[] = unknown[]>(key: TKey): Promise<R>
        getSetsMembers<R extends unknown[] = unknown[]>(keys: TKey[]): Promise<R[]>
        setCount(key: TKey): Promise<number>
        setsCount(keys: TKey[]): Promise<number[]>
        setRemoveRandom(key: TKey): Promise<unknown>
    }

    interface IGetSortedSetUnionParams<TKey extends TField = string> {
        sets: TKey[]
        stop: number
        start: number
        aggregate: string
        sort: 1 | -1
        withScores?: boolean
    }

    interface IGetSortSetIntersectParam<TKey extends TField = string> {
        sort: 1 | -1
        start?: number
        stop?: number
        weights: number[]
        sets: TKey[]
    }

    interface ISortSet<R> {
        value: R
        score: number
    }

    type TRangeMin = number | '-inf'
    type TRangeMax = number | '+inf'

    interface IGetSortedSetScanParam<TKey extends TField = string> {
        withScores?: boolean
        match: string
        key: TKey
        limit?: number
    }

    interface IProcessSortedSetOptions {
        withScores?: boolean
        batch?: number
        interval?: number
    }

    interface IDatabaseSortedSet<TKey extends TField = string> {
        sortedSetAdd(key: TKey, score: number | number[], value: unknown | unknown[]): Promise<void>
        sortedSetAddBulk(key: TKey, scores: number[], value: unknown[]): Promise<void>
        sortedSetsAdd(keys: TKey[], scores: number[], value: unknown): Promise<void>
        sortedSetAddBulk(data: [key: TKey, score: number, value: unknown][]): Promise<void>

        sortedSetRemove(key: TKey, value: unknown): Promise<void>
        sortedSetsRemove(keys: TKey[], value: unknown): Promise<void>
        sortedSetsRemoveRangeByScore(keys: TKey[], min: TRangeMin, max: TRangeMax): Promise<void>
        sortedSetRemoveBulk(data: [key: TKey, value: unknown][]): Promise<void>

        sortedSetUnionCard(keys: TKey[]): Promise<number[]>
        getSortedSetUnion<R extends unknown[] = unknown[]>(params: IGetSortedSetUnionParams): Promise<R[]>
        getSortedSetRevUnion<R extends unknown[] = unknown[]>(params: IGetSortedSetUnionParams): Promise<R[]>

        sortedSetIntersectCard(keys: TKey[]): Promise<number>
        getSortedSetIntersect<R extends unknown[] = unknown[]>(params: IGetSortSetIntersectParam): Promise<R[]>
        getSortedSetRevIntersect<R extends unknown[] = unknown[]>(params: IGetSortSetIntersectParam): Promise<R[]>

        getSortedSetRange<R extends unknown[] = unknown[]>(key: TKey, start: number, stop: number): Promise<R>
        getSortedSetRevRange<R extends unknown[] = unknown[]>(key: TKey, start: number, stop: number): Promise<R>
        getSortedSetRangeWithScores<RT = unknown, R extends ISortSet<RT>[] = ISortSet<any>[]>(key: TKey, start: number, stop: number): Promise<R>
        getSortedSetRevRangeWithScores<RT = unknown, R extends ISortSet<RT>[] = ISortSet<any>[]>(key: TKey, start: number, stop: number): Promise<R>
        getSortedSetRangeByScore<R extends unknown[] = unknown[]>(key: TKey, start: number, count: number, min: TRangeMin, max: TRangeMax): Promise<R>
        getSortedSetRevRangeByScore<R extends unknown[] = unknown[]>(key: TKey, start: number, count: number, min: TRangeMin, max: TRangeMax): Promise<R>
        getSortedSetRangeByScoreWithScores<RT = unknown, R extends ISortSet<RT>[] = ISortSet<any>[]>(key: TKey, start: number, count: number, min: TRangeMin, max: TRangeMax): Promise<R>
        getSortedSetRevRangeByScoreWithScores<RT = unknown, R extends ISortSet<RT>[] = ISortSet<any>[]>(key: TKey, start: number, count: number, min: TRangeMin, max: TRangeMax): Promise<R>
        sortedSetCount(key: TKey, min: TRangeMin, max: TRangeMax): Promise<number>
        sortedSetCard(key: TKey): Promise<number>
        sortedSetsCard(keys: TKey[]): Promise<number[]>
        sortedSetsCardSum(keys: TKey | TKey[]): Promise<number>
        sortedSetRank(key: TKey, value: unknown): Promise<number>
        sortedSetRevRank(key: TKey, value: unknown): Promise<number>
        sortedSetsRanks(keys: TKey[], values: unknown[]): Promise<number[]>
        sortedSetsRevRanks(keys: TKey[], values: unknown[]): Promise<number[]>
        sortedSetRanks(key: TKey, values: unknown[]): Promise<number[]>
        sortedSetRevRanks(key: TKey, values: unknown[]): Promise<number[]>
        sortedSetScore(key: TKey, value: unknown): Promise<number>
        sortedSetScores(key: TKey, values: unknown[]): Promise<number[]>
        isSortedSetMember(key: TKey, value: unknown): Promise<boolean>
        isSortedSetMembers(key: TKey, values: unknown[]): Promise<boolean[]>
        isMemberOfSortedSets(keys: TKey[], value: unknown): Promise<boolean[]>
        getSortedSetMembers<R extends unknown[] = unknown[]>(key: TKey): Promise<R>
        getSortedSetsMembers<R extends unknown[] = unknown[]>(key: TKey[]): Promise<R[]>
        sortedSetIncrBy(key: TKey, increment: number, value: unknown): Promise<void>
        getSortedSetRangeByLex<R extends unknown[] = unknown[]>(key: TKey, min: TRangeMin, max: TRangeMax, start: number, count: number): Promise<R>
        getSortedSetRevRangeByLex<R extends unknown[] = unknown[]>(key: TKey, min: TRangeMin, max: TRangeMax, start: number, count: number): Promise<R>
        sortedSetLexCount(key: TKey, min: TRangeMin, max: TRangeMax): Promise<number[]>
        sortedSetRemoveRangeByLex(key: TKey, min: TRangeMin, max: TRangeMax): Promise<void>
        getSortedSetScan<R extends unknown[] = unknown[]>(params: IGetSortedSetScanParam & {withScores: false}): Promise<R[]>
        getSortedSetScan<RT = unknown, R extends ISortSet<RT>[] = ISortSet<any>[]>(params: IGetSortedSetScanParam & {withScores: true}): Promise<R[]>
        processSortedSet<R extends unknown[] = unknown[]>(setKey: TKey, processFn: (set: R) => Promise<void>, options: IProcessSortedSetOptions & {withScores: false}): Promise<void>
        processSortedSet<RT = unknown, R extends ISortSet<RT>[] = ISortSet<any>[]>(setKey: TKey, processFn: (set: R) => Promise<void>, options: IProcessSortedSetOptions & {withScores: true}): Promise<void>
    }

    interface IDatabaseList<TKey extends TField = string> {
        listPrepend(key: TKey, value: unknown): Promise<void>
        listAppend(key: TKey, value: unknown): Promise<void>
        listRemoveLast<R = unknown>(key: TKey): Promise<R>
        listRemoveAll(key: TKey, value: unknown): Promise<void>
        listTrim(key: TKey, start: number, stop: number): Promise<void>
        getListRange<R extends unknown[] = unknown[]>(key: TKey, start: number, stop: number): Promise<[...R]>
        listLength(key: TKey): Promise<number>
    }

    interface IDatabaseTransaction {
        transaction(perform: (client: unknown, cb: (err: Error) => void) => void, cb: (err: Error) => void): void
    }

    export interface IDatabase<TKey extends TField = string> extends IDatabaseMain<TKey>, IDatabaseHash<TKey>, IDatabaseSet<TKey>, IDatabaseSortedSet<TKey>, IDatabaseList<TKey> {
        parseIntFields<T>(data: T, intFields: string[], requestedFields: string[]): void
        initSessionStore(): Promise<void>
        init(): Promise<void>
        createSessionStore(options: unknown): Promise<session.Store>
        createIndices(): Promise<void>
        checkCompatibility(cb: (err: Error) => void): void
        checkCompatibilityVersion(version: string, cb: (err: Error) => void): void
        info(db?: unknown): Promise<Record<string, unknown>>
        getCollectionStats(db: unknown): Promise<Record<string, unknown>>
        close(cb: (err: Error) => void): void
    }

    export = IDatabase
}
