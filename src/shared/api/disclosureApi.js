const USE_MOCK = true;

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// =========================
// 더미 데이터
// =========================

// 공시 목록 조회 형태
export const mockDisclosureListResponse = {
  totalCount: 158,
  page: 1,
  limit: 20,
  disclosures: [
    // ===== 한온시스템 =====
    {
      _id: "20250925800487",
      reportName: "기업설명회(IR)개최(안내공시)",
      company: {
        corpCode: "00161125",
        corpName: "한온시스템",
        stockCode: "018880",
        corpCls: "Y",
      },
      receptionDate: "2025-09-25T00:00:00Z",
      tags: ["IR", "기업설명회"],
      summary: {
        data: {
          text: "3분기 실적 발표 관련 기관투자자 대상 IR 예정",
        },
      },
      createdAt: "2025-09-25T13:00:05Z",
      updatedAt: "2025-09-25T14:30:15Z",
    },
    {
      _id: "20250925000485",
      reportName: "[기재정정]주요사항보고서(유상증자결정)",
      company: {
        corpCode: "00161125",
        corpName: "한온시스템",
        stockCode: "018880",
        corpCls: "Y",
      },
      receptionDate: "2025-09-25T00:00:00Z",
      tags: ["유상증자"],
      summary: null,
      createdAt: "2025-09-25T12:55:10Z",
      updatedAt: "2025-09-25T12:55:10Z",
    },

    // ===== 삼성전자 =====
    {
      _id: "20250924800123",
      reportName: "분기보고서 (2025.09)",
      company: {
        corpCode: "00126380",
        corpName: "삼성전자",
        stockCode: "005930",
        corpCls: "Y",
      },
      receptionDate: "2025-09-24T00:00:00Z",
      tags: ["분기보고서", "실적"],
      summary: {
        data: {
          text: "반도체 부문 회복으로 전년 대비 매출 15% 증가",
        },
      },
      createdAt: "2025-09-24T15:10:00Z",
      updatedAt: "2025-09-24T16:20:00Z",
    },
    {
      _id: "20250923000999",
      reportName: "주요사항보고서(자회사 투자 결정)",
      company: {
        corpCode: "00126380",
        corpName: "삼성전자",
        stockCode: "005930",
        corpCls: "Y",
      },
      receptionDate: "2025-09-23T00:00:00Z",
      tags: ["투자"],
      summary: {
        data: {
          text: "차세대 AI 반도체 생산라인 증설 투자 결정",
        },
      },
      createdAt: "2025-09-23T11:22:00Z",
      updatedAt: "2025-09-23T11:22:00Z",
    },
    {
      _id: "20250922000111",
      reportName: "기업설명회(IR) 개최",
      company: {
        corpCode: "00126380",
        corpName: "삼성전자",
        stockCode: "005930",
        corpCls: "Y",
      },
      receptionDate: "2025-09-22T00:00:00Z",
      tags: ["IR"],
      summary: null,
      createdAt: "2025-09-22T09:10:00Z",
      updatedAt: "2026-03-10T09:10:00Z",
    },

    // ===== SK하이닉스 =====
    {
      _id: "20250921000456",
      reportName: "반기보고서",
      company: {
        corpCode: "00164779",
        corpName: "SK하이닉스",
        stockCode: "000660",
        corpCls: "Y",
      },
      receptionDate: "2025-09-21T00:00:00Z",
      tags: ["반기보고서"],
      summary: {
        data: {
          text: "HBM 수요 증가로 영업이익 개선",
        },
      },
      createdAt: "2025-09-21T14:00:00Z",
      updatedAt: "2025-09-21T14:00:00Z",
    },
  ],
};

// 공시 URL 조회 형태
const mockDisclosureUrlResponse = {
  _id: "20250925800487",
  downloadUrl:
    "https://minio.dartoo.com/documents/20250925800487.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  expiresAt: "2025-09-25T15:30:00Z",
  contentType: "application/pdf",
  fileSize: 1048576,
};

// ===== helper 함수 =====

// 감정 태그 자동 부여
function getSentimentTag(tags = []) {
  if (tags.includes("유상증자")) return "negative";
  if (
    tags.includes("실적") ||
    tags.includes("IR") ||
    tags.includes("기업설명회")
  ) {
    return "positive";
  }
  return "neutral";
}

// 공시 원문 URL mock 생성
function makeOriginalDocumentUrl(id) {
  return `https://minio.dartoo.com/documents/${id}.pdf`;
}

// 공시 목록으로부터 기업별 묶음 생성
function buildCompanyMapFromDisclosures() {
  const companyMap = new Map();

  mockDisclosureListResponse.disclosures.forEach((item) => {
    const { corpCode, corpName, stockCode, corpCls } = item.company;

    if (!companyMap.has(corpCode)) {
      companyMap.set(corpCode, {
        corpCode,
        corpName,
        stockCode,
        corpCls,
        disclosureCount: 0,
        latestDisclosureDate: item.receptionDate,
        tags: new Set(),
        disclosures: [],
      });
    }

    const company = companyMap.get(corpCode);

    company.disclosureCount += 1;

    if (
      new Date(item.receptionDate).getTime() >
      new Date(company.latestDisclosureDate).getTime()
    ) {
      company.latestDisclosureDate = item.receptionDate;
    }

    (item.tags || []).forEach((tag) => company.tags.add(tag));

    company.disclosures.push({
      _id: item._id,
      reportName: item.reportName,
      receptionDate: item.receptionDate,
      updatedAt: item.updatedAt,
      originalDocumentUrl: makeOriginalDocumentUrl(item._id),
      tags: item.tags || [],
      sentimentTag: getSentimentTag(item.tags || []),
      summary: item.summary?.data?.text
        ? { text: item.summary.data.text }
        : null,
    });
  });

  return companyMap;
}

// 기업 목록 조회용 배열
function buildCompanyList() {
  const companyMap = buildCompanyMapFromDisclosures();

  return Array.from(companyMap.values())
    .map((company) => ({
      corpCode: company.corpCode,
      corpName: company.corpName,
      stockCode: company.stockCode,
      corpCls: company.corpCls,
      disclosureCount: company.disclosureCount,
      latestDisclosureDate: company.latestDisclosureDate,
      tags: Array.from(company.tags),
    }))
    .sort(
      (a, b) =>
        new Date(b.latestDisclosureDate).getTime() -
        new Date(a.latestDisclosureDate).getTime(),
    );
}

// 기업 상세 조회용 배열
function buildCompanyDetailList() {
  const companyMap = buildCompanyMapFromDisclosures();

  return Array.from(companyMap.values())
    .map((company) => ({
      corpCode: company.corpCode,
      corpName: company.corpName,
      stockCode: company.stockCode,
      corpCls: company.corpCls,
      disclosureCount: company.disclosureCount,
      latestDisclosureDate: company.latestDisclosureDate,
      tags: Array.from(company.tags),
      disclosures: {
        items: company.disclosures.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
      },
    }))
    .sort(
      (a, b) =>
        new Date(b.latestDisclosureDate).getTime() -
        new Date(a.latestDisclosureDate).getTime(),
    );
}

// 검색용 추가 기업
const extraSearchCompanies = [
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
    corpCode: "00164781",
    corpName: "LG전자",
    stockCode: "066570",
    corpCls: "Y",
    disclosureCount: 401,
    latestDisclosureDate: "2025-09-19T00:00:00Z",
    tags: ["가전", "실적"],
  },
];

function getMatchType(company, term) {
  if (company.corpName.toLowerCase().includes(term)) return "corpName";
  if ((company.stockCode || "").toLowerCase().includes(term))
    return "stockCode";
  if ((company.tags || []).some((tag) => tag.toLowerCase().includes(term))) {
    return "tag";
  }
  return "corpName";
}

function getRelevanceScore(company, term) {
  const corpName = company.corpName.toLowerCase();
  const stockCode = (company.stockCode || "").toLowerCase();

  if (corpName === term) return 1.0;
  if (corpName.startsWith(term)) return 0.98;
  if (corpName.includes(term)) return 0.9;
  if (stockCode.includes(term)) return 0.82;
  return 0.75;
}

// 단일 공시 조회용
function buildSingleDisclosureMap() {
  const map = new Map();

  mockDisclosureListResponse.disclosures.forEach((item) => {
    map.set(item._id, {
      _id: item._id,
      reportName: item.reportName,
      company: item.company,
      flrName: item.company.corpName,
      receptionDate: item.receptionDate,
      remark: "유",
      originalDocumentUrl: makeOriginalDocumentUrl(item._id),
      tags: item.tags || [],
      summary: item.summary?.data?.text
        ? {
            data: {
              text: item.summary.data.text,
            },
            workerVersion: "1.1.0",
            summarizedAt: item.updatedAt,
          }
        : null,
      schemaVersion: "1.0",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  });

  return map;
}

export const disclosureApi = {
  // 공시 목록 조회
  async getDisclosures(params = {}) {
    if (USE_MOCK) {
      await wait(300);

      const { corpCode, page = 1, limit } = params;

      let result = [...mockDisclosureListResponse.disclosures];

      if (corpCode) {
        result = result.filter((item) => item.company.corpCode === corpCode);
      }

      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const currentLimit = limit ?? result.length;
      const startIndex = (page - 1) * currentLimit;
      const endIndex = startIndex + currentLimit;
      const pagedResult = result.slice(startIndex, endIndex);

      return {
        totalCount: result.length,
        page,
        limit: currentLimit,
        disclosures: pagedResult,
      };
    }

    /*
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/disclosures${query ? `?${query}` : ""}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("공시 목록 조회 실패");
    return res.json();
    */
  },

  // 단일 공시 조회
  async getDisclosureById(id) {
    if (USE_MOCK) {
      await wait(300);

      const disclosureMap = buildSingleDisclosureMap();
      const found = disclosureMap.get(id);

      if (!found) {
        throw new Error("공시를 찾을 수 없습니다.");
      }

      return found;
    }

    /*
    const res = await fetch(`/api/disclosures/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("단일 공시 조회 실패");
    return res.json();
    */
  },

  // 공시 원문 URL 조회
  async getDisclosureDownloadUrl(id) {
    if (USE_MOCK) {
      await wait(300);

      const exists = mockDisclosureListResponse.disclosures.some(
        (item) => item._id === id,
      );

      if (!exists) {
        throw new Error("원문 URL을 찾을 수 없습니다.");
      }

      return {
        ...mockDisclosureUrlResponse,
        _id: id,
        downloadUrl: `https://minio.dartoo.com/documents/${id}.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...`,
      };
    }

    /*
    const res = await fetch(`/api/disclosures/${id}/download`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("공시 원문 URL 조회 실패");
    return res.json();
    */
  },

  // 기업 목록 조회
  async getCompanies(params = {}) {
    if (USE_MOCK) {
      await wait(300);

      const { page = 1, limit } = params;
      const companies = buildCompanyList();

      const currentLimit = limit ?? companies.length;
      const startIndex = (page - 1) * currentLimit;
      const endIndex = startIndex + currentLimit;
      const pagedCompanies = companies.slice(startIndex, endIndex);

      return {
        totalCount: companies.length,
        page,
        limit: currentLimit,
        companies: pagedCompanies,
      };
    }

    /*
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/disclosures/company${query ? `?${query}` : ""}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("기업 목록 조회 실패");
    return res.json();
    */
  },

  // 기업 검색
  async searchCompanies(keyword = "") {
    if (USE_MOCK) {
      await wait(300);

      const term = keyword.trim().toLowerCase();

      if (!term) {
        return {
          query: keyword,
          totalCount: 0,
          results: [],
        };
      }

      const disclosureCompanies = buildCompanyList();

      const mergedMap = new Map();

      [...disclosureCompanies, ...extraSearchCompanies].forEach((company) => {
        if (!mergedMap.has(company.corpCode)) {
          mergedMap.set(company.corpCode, company);
        }
      });

      const baseCompanies = Array.from(mergedMap.values());

      const filtered = baseCompanies
        .filter((item) => {
          const corpName = item.corpName.toLowerCase();
          const stockCode = (item.stockCode || "").toLowerCase();
          const tags = item.tags || [];

          return (
            corpName.includes(term) ||
            stockCode.includes(term) ||
            tags.some((tag) => tag.toLowerCase().includes(term))
          );
        })
        .map((item) => ({
          ...item,
          matchType: getMatchType(item, term),
          relevanceScore: getRelevanceScore(item, term),
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
        query: keyword,
        totalCount: filtered.length,
        results: filtered,
      };
    }

    /*
    const query = new URLSearchParams({ keyword }).toString();
    const res = await fetch(`/api/disclosures/company/search?${query}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("기업 검색 실패");
    return res.json();
    */
  },

  // 기업 상세 조회
  async getCompanyDetail(corpCode) {
    if (USE_MOCK) {
      await wait(300);

      const companyDetails = buildCompanyDetailList();
      const found = companyDetails.find((item) => item.corpCode === corpCode);

      if (!found) {
        throw new Error("기업 정보를 찾을 수 없습니다.");
      }

      return found;
    }

    /*
    const res = await fetch(`/api/disclosures/company/${corpCode}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("기업 상세 조회 실패");
    return res.json();
    */
  },
};
