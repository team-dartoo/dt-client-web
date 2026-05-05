import { requireServiceBaseUrl } from "./serviceConfig";

const USE_REAL_DISCLOSURE =
  import.meta.env.VITE_USE_REAL_DISCLOSURE === "true";
const USE_MOCK = !USE_REAL_DISCLOSURE;
let disclosureBase = null;
let disclosureWorkerApiKey = null;

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const getDisclosureBase = () => {
  if (disclosureBase) {
    return disclosureBase;
  }

  const disclosureServiceBase = requireServiceBaseUrl(
    "VITE_DISCLOSURE_SERVICE_BASE_URL",
    "Disclosure service",
  );

  disclosureBase = `${disclosureServiceBase}/api/disclosures`;
  return disclosureBase;
};

const getDisclosureWorkerApiKey = () => {
  if (disclosureWorkerApiKey !== null) {
    return disclosureWorkerApiKey;
  }

  const configuredKey = import.meta.env.VITE_DISCLOSURE_WORKER_API_KEY;
  disclosureWorkerApiKey = typeof configuredKey === "string" ? configuredKey.trim() : "";
  return disclosureWorkerApiKey;
};

const isLocalDisclosureService = () => {
  try {
    const baseUrl = new URL(getDisclosureBase());
    return ["localhost", "127.0.0.1"].includes(baseUrl.hostname);
  } catch (error) {
    void error;
    return false;
  }
};

const buildUrl = (path = "", params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  ).toString();

  return `${getDisclosureBase()}${path}${query ? `?${query}` : ""}`;
};

const parseResponseBody = async (res) => {
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await res.json();
  } catch (error) {
    void error;
    return null;
  }
};

const request = async (path = "", params = {}, options = {}) => {
  const { method = "GET", body, headers = {} } = options;

  const res = await fetch(buildUrl(path, params), {
    method,
    credentials: "include",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await parseResponseBody(res);

  if (res.ok) {
    return data;
  }

  let message = "공시 정보를 불러오지 못했습니다.";

  message = data?.message || data?.detail || data?.error || message;

  const error = new Error(message);
  error.status = res.status;
  throw error;
};

const normalizeSummary = (summary, fallbackSentimentTag = null) => {
  if (!summary && !fallbackSentimentTag) {
    return null;
  }

  return {
    data: Array.isArray(summary?.data) ? summary.data : null,
    workerVersion: summary?.workerVersion ?? null,
    summarizedAt: summary?.summarizedAt ?? null,
    sentimentTag: summary?.sentimentTag ?? fallbackSentimentTag ?? null,
  };
};

const normalizeDisclosure = (item = {}) => ({
  ...item,
  tags: Array.isArray(item.tags) ? item.tags : [],
  company: item.company
    ? {
        corpCode: item.company.corpCode,
        corpName: item.company.corpName,
        stockCode: item.company.stockCode ?? null,
        corpCls: item.company.corpCls ?? "E",
      }
    : {
        corpCode: "",
        corpName: "",
        stockCode: null,
        corpCls: "E",
      },
  summary: normalizeSummary(item.summary),
});

const normalizeDisclosureListResponse = (data = {}) => ({
  totalCount: data.totalCount ?? 0,
  page: data.page ?? 1,
  limit: data.limit ?? 20,
  disclosures: Array.isArray(data.disclosures)
    ? data.disclosures.map(normalizeDisclosure)
    : [],
});

const normalizeCompanyListItem = (company = {}) => ({
  ...company,
  stockCode: company.stockCode ?? null,
  corpCls: company.corpCls ?? "E",
  tags: Array.isArray(company.tags) ? company.tags : [],
  latestDisclosureDate: company.latestDisclosureDate ?? null,
});

const normalizeCompanyListResponse = (data = {}) => ({
  totalCount: data.totalCount ?? 0,
  page: data.page ?? 1,
  limit: data.limit ?? 20,
  companies: Array.isArray(data.companies)
    ? data.companies.map(normalizeCompanyListItem)
    : [],
});

const normalizeCompanySearchResponse = (data = {}) => ({
  query: data.query ?? "",
  totalCount: data.totalCount ?? 0,
  results: Array.isArray(data.results)
    ? data.results.map(normalizeCompanyListItem)
    : [],
});

const normalizeCompanyDetailResponse = (data = {}) => ({
  ...normalizeCompanyListItem(data),
  disclosures: {
    items: Array.isArray(data.disclosures?.items)
      ? data.disclosures.items.map((item) => ({
          ...item,
          tags: Array.isArray(item.tags) ? item.tags : [],
          remark: item.remark ?? null,
          summary: normalizeSummary(item.summary, item.sentimentTag),
          originalDocumentUrl: item.originalDocumentUrl ?? "",
        }))
      : [],
  },
});

const FIXTURE_DISCLOSURES = [
  {
    id: "20250925800487",
    payload: {
      reportName: "기업설명회(IR)개최(안내공시)",
      corpCode: "00161125",
      corpName: "한온시스템",
      stockCode: "018880",
      corpCls: "Y",
      flrName: "한온시스템",
      receptionDate: "2025-09-25T00:00:00Z",
      remark: "유",
      minioObjectName: "documents/20250925800487.pdf",
      contentType: "application/pdf",
      fileSize: 1048576,
      tags: ["IR", "기업설명회"],
    },
  },
  {
    id: "20250924800123",
    payload: {
      reportName: "분기보고서 (2025.09)",
      corpCode: "00126380",
      corpName: "삼성전자",
      stockCode: "005930",
      corpCls: "Y",
      flrName: "삼성전자",
      receptionDate: "2025-09-24T00:00:00Z",
      remark: null,
      minioObjectName: "documents/20250924800123.pdf",
      contentType: "application/pdf",
      fileSize: 1048576,
      tags: ["분기보고서", "실적"],
    },
  },
];

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
      flrName: "한온시스템",
      receptionDate: "2025-09-25T00:00:00Z",
      remark: "유",
      originalDocumentUrl:
        "https://minio.dartoo.com/documents/20250925800487.pdf",
      tags: ["IR", "기업설명회"],
      summary: {
        data: [
          "당사는 2025년 10월 1일, 3분기 실적 발표 관련하여 국내외 기관투자자를 대상으로 기업설명회(IR)를 개최할 예정입니다.",
          "",
          "",
        ],
        workerVersion: "1.2.0",
        summarizedAt: "2025-09-25T14:30:15Z",
        sentimentTag: "호재",
      },
      schemaVersion: "1.0",
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
      flrName: "한온시스템",
      receptionDate: "2025-09-25T00:00:00Z",
      remark: null,
      originalDocumentUrl:
        "https://minio.dartoo.com/documents/20250925000485.pdf",
      tags: ["유상증자", "기재정정"],
      summary: null,
      schemaVersion: "1.0",
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
      flrName: "삼성전자",
      receptionDate: "2025-09-24T00:00:00Z",
      remark: null,
      originalDocumentUrl:
        "https://minio.dartoo.com/documents/20250924800123.pdf",
      tags: ["분기보고서", "실적"],
      summary: {
        data: [
          "반도체 부문 회복으로 전년 대비 매출이 증가했습니다.",
          "주요 사업 부문의 수익성이 개선되었습니다.",
          "",
        ],
        workerVersion: "1.2.0",
        summarizedAt: "2025-09-24T16:20:00Z",
        sentimentTag: "호재",
      },
      schemaVersion: "1.0",
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
      flrName: "삼성전자",
      receptionDate: "2025-09-23T00:00:00Z",
      remark: null,
      originalDocumentUrl:
        "https://minio.dartoo.com/documents/20250923000999.pdf",
      tags: ["투자"],
      summary: {
        data: [
          "차세대 AI 반도체 생산라인 증설을 위한 투자 결정이 공시되었습니다.",
          "",
          "",
        ],
        workerVersion: "1.2.0",
        summarizedAt: "2025-09-23T11:22:00Z",
        sentimentTag: "호재",
      },
      schemaVersion: "1.0",
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
      flrName: "삼성전자",
      receptionDate: "2025-09-22T00:00:00Z",
      remark: null,
      originalDocumentUrl:
        "https://minio.dartoo.com/documents/20250922000111.pdf",
      tags: ["IR"],
      summary: null,
      schemaVersion: "1.0",
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
      flrName: "SK하이닉스",
      receptionDate: "2025-09-21T00:00:00Z",
      remark: null,
      originalDocumentUrl:
        "https://minio.dartoo.com/documents/20250921000456.pdf",
      tags: ["반기보고서"],
      summary: {
        data: ["HBM 수요 증가로 영업이익이 개선되었습니다.", "", ""],
        workerVersion: "1.2.0",
        summarizedAt: "2025-09-21T14:00:00Z",
        sentimentTag: "호재",
      },
      schemaVersion: "1.0",
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
      flrName: item.flrName,
      receptionDate: item.receptionDate,
      remark: item.remark,
      updatedAt: item.updatedAt,
      originalDocumentUrl: item.originalDocumentUrl,
      tags: item.tags || [],
      summary: item.summary,
      schemaVersion: item.schemaVersion,
      createdAt: item.createdAt,
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
    corpCode: "00126362",
    corpName: "삼성SDI",
    stockCode: "006400",
    corpCls: "Y",
    disclosureCount: 456,
    latestDisclosureDate: "2025-09-24T00:00:00Z",
    tags: ["분기보고서", "주주총회"],
  },
  {
    corpCode: "00149655",
    corpName: "삼성물산",
    stockCode: "028260",
    corpCls: "Y",
    disclosureCount: 320,
    latestDisclosureDate: "2025-09-23T00:00:00Z",
    tags: ["IR", "건설"],
  },
  {
    corpCode: "00258801",
    corpName: "카카오",
    stockCode: "035720",
    corpCls: "Y",
    disclosureCount: 210,
    latestDisclosureDate: "2025-09-20T00:00:00Z",
    tags: ["플랫폼", "사업보고서"],
  },
  {
    corpCode: "01137383",
    corpName: "카카오게임즈",
    stockCode: "293490",
    corpCls: "Y",
    disclosureCount: 98,
    latestDisclosureDate: "2025-09-18T00:00:00Z",
    tags: ["게임", "분기보고서"],
  },
  {
    corpCode: "01133217",
    corpName: "카카오뱅크",
    stockCode: "323410",
    corpCls: "Y",
    disclosureCount: 122,
    latestDisclosureDate: "2025-09-17T00:00:00Z",
    tags: ["금융", "실적"],
  },
  {
    corpCode: "00401731",
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
      flrName: item.flrName,
      receptionDate: item.receptionDate,
      remark: item.remark,
      originalDocumentUrl: item.originalDocumentUrl,
      tags: item.tags || [],
      summary: item.summary,
      schemaVersion: item.schemaVersion,
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

    const data = await request("", params);
    return normalizeDisclosureListResponse(data);
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

    const data = await request(`/${id}`);
    return normalizeDisclosure(data);
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

    return request(`/${id}/download`);
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

    const data = await request("/company", params);
    return normalizeCompanyListResponse(data);
  },

  // 기업 검색
  async searchCompanies(keyword = "", params = {}) {
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

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return {
        query: keyword,
        totalCount: 0,
        results: [],
      };
    }

    const data = await request("/company/search", {
      word: trimmedKeyword,
      tags: params.tags,
      limit: params.limit,
    });
    return normalizeCompanySearchResponse(data);
  },

  // 기업 상세 조회
  async getCompanyDetail(corpCode, params = {}) {
    if (USE_MOCK) {
      await wait(300);

      const companyDetails = buildCompanyDetailList();
      const found = companyDetails.find((item) => item.corpCode === corpCode);

      if (!found) {
        throw new Error("기업 정보를 찾을 수 없습니다.");
      }

      return found;
    }

    const data = await request(`/company/${corpCode}`, {
      disclosurePage: params.disclosurePage ?? params.page,
      disclosureLimit: params.disclosureLimit ?? params.limit,
      tags: params.tags,
    });
    return normalizeCompanyDetailResponse(data);
  },

  async bootstrapLocalFixtures({ force = false } = {}) {
    if (USE_MOCK) {
      return {
        bootstrapped: false,
        skipped: true,
        reason: "mock-mode",
      };
    }

    if (!isLocalDisclosureService()) {
      return {
        bootstrapped: false,
        skipped: true,
        reason: "non-local-disclosure-service",
      };
    }

    const workerApiKey = getDisclosureWorkerApiKey();

    if (!workerApiKey) {
      throw new Error(
        "로컬 공시 fixture 부트스트랩을 위해 VITE_DISCLOSURE_WORKER_API_KEY가 필요합니다.",
      );
    }

    if (!force) {
      const existing = await request("", { page: 1, limit: 1 });
      if ((existing?.totalCount ?? 0) > 0) {
        return {
          bootstrapped: false,
          skipped: true,
          reason: "existing-disclosures",
        };
      }
    }

    const seeded = [];

    for (const fixture of FIXTURE_DISCLOSURES) {
      const result = await request(`/${fixture.id}`, {}, {
        method: "PUT",
        body: fixture.payload,
        headers: {
          "X-Worker-API-Key": workerApiKey,
        },
      });

      seeded.push({
        id: result?._id ?? fixture.id,
        created: result?.created ?? false,
      });
    }

    return {
      bootstrapped: true,
      seeded,
    };
  },
};
