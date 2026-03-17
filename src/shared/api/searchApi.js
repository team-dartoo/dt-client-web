// src/apis/searchApi.js
import { mockDisclosureListResponse } from "./disclosureApi";

const USE_MOCK = true;
const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_HISTORY = 20; // 최근 검색어 최대 20개 저장
const HISTORY_EXPIRE_DAYS = 90; // 최근 90일만 유지

let mockSearchHistoryList = [
  {
    historyId: "234243",
    query: "삼성전자",
    searchedAt: "2026-02-09T12:30:00Z",
  },
  {
    historyId: "234244",
    query: "카카오",
    searchedAt: "2026-02-11T12:30:00Z",
  },
  {
    historyId: "234245",
    query: "한온시스템",
    searchedAt: "2026-02-13T09:20:00Z",
  },
  {
    historyId: "234246",
    query: "SK하이닉스",
    searchedAt: "2026-02-14T15:10:00Z",
  },
];

// 공시 mock 데이터에 있는 기업은 검색에서도 반드시 포함
const extraCompanies = [
  {
    corpCode: "00356361",
    corpName: "카카오",
    stockCode: "035720",
    corpCls: "Y",
    disclosureCount: 210,
    latestDisclosureDate: "2025-09-20T00:00:00Z",
    tags: ["플랫폼", "사업보고서"],
  },
  {
    corpCode: "01013517",
    corpName: "카카오게임즈",
    stockCode: "293490",
    corpCls: "Y",
    disclosureCount: 98,
    latestDisclosureDate: "2025-09-18T00:00:00Z",
    tags: ["게임", "분기보고서"],
  },
  {
    corpCode: "01660985",
    corpName: "카카오뱅크",
    stockCode: "323410",
    corpCls: "Y",
    disclosureCount: 122,
    latestDisclosureDate: "2025-09-17T00:00:00Z",
    tags: ["금융", "실적"],
  },
  {
    corpCode: "00164742",
    corpName: "삼성SDI",
    stockCode: "006400",
    corpCls: "Y",
    disclosureCount: 456,
    latestDisclosureDate: "2025-09-24T00:00:00Z",
    tags: ["분기보고서", "주주총회"],
  },
  {
    corpCode: "00164800",
    corpName: "삼성물산",
    stockCode: "028260",
    corpCls: "Y",
    disclosureCount: 320,
    latestDisclosureDate: "2025-09-23T00:00:00Z",
    tags: ["IR", "건설"],
  },
  {
    corpCode: "00164779",
    corpName: "LG전자",
    stockCode: "066570",
    corpCls: "Y",
    disclosureCount: 401,
    latestDisclosureDate: "2025-09-19T00:00:00Z",
    tags: ["가전", "실적"],
  },
];

function buildCompanySearchBase() {
  const disclosureCompaniesMap = new Map();

  mockDisclosureListResponse.disclosures.forEach((item) => {
    const { corpCode, corpName, stockCode, corpCls } = item.company;

    if (!disclosureCompaniesMap.has(corpCode)) {
      disclosureCompaniesMap.set(corpCode, {
        corpCode,
        corpName,
        stockCode,
        corpCls,
        disclosureCount: 0,
        latestDisclosureDate: item.receptionDate,
        tags: new Set(item.tags || []),
      });
    }

    const target = disclosureCompaniesMap.get(corpCode);
    target.disclosureCount += 1;

    if (
      new Date(item.receptionDate).getTime() >
      new Date(target.latestDisclosureDate).getTime()
    ) {
      target.latestDisclosureDate = item.receptionDate;
    }

    (item.tags || []).forEach((tag) => target.tags.add(tag));
  });

  const disclosureCompanies = Array.from(disclosureCompaniesMap.values()).map(
    (item) => ({
      ...item,
      tags: Array.from(item.tags),
    }),
  );

  const mergedMap = new Map();

  [...disclosureCompanies, ...extraCompanies].forEach((company) => {
    if (!mergedMap.has(company.corpCode)) {
      mergedMap.set(company.corpCode, company);
      return;
    }

    const prev = mergedMap.get(company.corpCode);

    mergedMap.set(company.corpCode, {
      ...prev,
      ...company,
      tags: Array.from(
        new Set([...(prev.tags || []), ...(company.tags || [])]),
      ),
      disclosureCount: Math.max(
        prev.disclosureCount || 0,
        company.disclosureCount || 0,
      ),
      latestDisclosureDate:
        new Date(prev.latestDisclosureDate).getTime() >
        new Date(company.latestDisclosureDate).getTime()
          ? prev.latestDisclosureDate
          : company.latestDisclosureDate,
    });
  });

  return Array.from(mergedMap.values());
}

function getMatchType(company, term) {
  if (company.corpName.toLowerCase().includes(term)) return "corpName";
  if (company.stockCode?.toLowerCase().includes(term)) return "stockCode";
  if (company.tags?.some((tag) => tag.toLowerCase().includes(term)))
    return "tag";
  return "corpName";
}

function getRelevanceScore(company, term) {
  const name = company.corpName.toLowerCase();
  const stockCode = (company.stockCode || "").toLowerCase();

  if (name === term) return 1.0;
  if (name.startsWith(term)) return 0.98;
  if (name.includes(term)) return 0.9;
  if (stockCode.includes(term)) return 0.82;
  return 0.75;
}

function pruneHistories(list) {
  const now = Date.now();
  const expireMs = HISTORY_EXPIRE_DAYS * 24 * 60 * 60 * 1000;

  return list
    .filter((item) => now - new Date(item.searchedAt).getTime() <= expireMs)
    .sort((a, b) => new Date(b.searchedAt) - new Date(a.searchedAt))
    .slice(0, MAX_HISTORY);
}

export const searchApi = {
  async getSearchHistories() {
    if (USE_MOCK) {
      await wait();

      mockSearchHistoryList = pruneHistories(mockSearchHistoryList);

      return {
        historyList: mockSearchHistoryList,
      };
    }

    // TODO 실제 API
    /*
    const res = await fetch(`/api/users/search-histories?limit=${MAX_HISTORY}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("검색 기록 조회 실패");
    return res.json();
    */
  },

  async addSearchHistory(query) {
    if (USE_MOCK) {
      await wait();

      const trimmed = query.trim();
      if (!trimmed) {
        throw new Error("검색어가 비어 있습니다.");
      }

      mockSearchHistoryList = mockSearchHistoryList.filter(
        (item) => item.query !== trimmed,
      );

      const newItem = {
        historyId: String(Date.now()),
        query: trimmed,
        searchedAt: new Date().toISOString(),
      };

      mockSearchHistoryList = pruneHistories([
        newItem,
        ...mockSearchHistoryList,
      ]);

      return newItem;
    }

    // TODO 실제 API
    /*
    const res = await fetch("/api/users/search-histories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error("검색 기록 추가 실패");
    return res.json();
    */
  },

  async removeSearchHistory(historyId) {
    if (USE_MOCK) {
      await wait();

      mockSearchHistoryList = mockSearchHistoryList.filter(
        (item) => item.historyId !== historyId,
      );

      return true;
    }

    // TODO 실제 API
    /*
    const res = await fetch(`/api/users/search-histories/${historyId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("검색 기록 삭제 실패");
    return true;
    */
  },

  async searchCompanies(word = "") {
    if (USE_MOCK) {
      await wait();

      const term = word.trim().toLowerCase();

      if (!term) {
        return {
          query: word,
          totalCount: 0,
          results: [],
        };
      }

      const companies = buildCompanySearchBase();

      const filtered = companies
        .filter((company) => {
          const corpName = company.corpName.toLowerCase();
          const stockCode = (company.stockCode || "").toLowerCase();
          const tags = company.tags || [];

          return (
            corpName.includes(term) ||
            stockCode.includes(term) ||
            tags.some((tag) => tag.toLowerCase().includes(term))
          );
        })
        .map((company) => ({
          ...company,
          matchType: getMatchType(company, term),
          relevanceScore: getRelevanceScore(company, term),
        }))
        .sort((a, b) => {
          if (b.relevanceScore !== a.relevanceScore) {
            return b.relevanceScore - a.relevanceScore;
          }

          return (
            new Date(b.latestDisclosureDate).getTime() -
            new Date(a.latestDisclosureDate).getTime()
          );
        });

      return {
        query: word,
        totalCount: filtered.length,
        results: filtered,
      };
    }

    // TODO 실제 API
    /*
    const query = new URLSearchParams({ word }).toString();
    const res = await fetch(`/api/disclosures/company/search?${query}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("기업 검색 실패");
    return res.json();
    */
  },
};
