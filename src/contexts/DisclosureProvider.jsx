import React, { useCallback, useMemo, useState } from "react";
import { DisclosureContext } from "./DisclosureContext";
import { disclosureApi } from "../shared/api/disclosureApi";

export const DisclosureProvider = ({ children }) => {
  const [disclosures, setDisclosures] = useState([]);
  const [disclosureListMeta, setDisclosureListMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: 20,
  });

  const [selectedDisclosure, setSelectedDisclosure] = useState(null);
  const [downloadInfo, setDownloadInfo] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [companyListMeta, setCompanyListMeta] = useState({
    totalCount: 0,
    page: 1,
    limit: 20,
  });

  const [searchedCompanies, setSearchedCompanies] = useState([]);
  const [searchMeta, setSearchMeta] = useState({
    query: "",
    totalCount: 0,
  });

  const [selectedCompany, setSelectedCompany] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 공시 목록 조회
  const fetchDisclosures = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const data = await disclosureApi.getDisclosures(params);

      setDisclosures(data.disclosures ?? []);
      setDisclosureListMeta({
        totalCount: data.totalCount ?? 0,
        page: data.page ?? 1,
        limit: data.limit ?? 20,
      });

      return data;
    } catch (err) {
      setError(err.message || "공시 목록 조회 실패");
      console.error("공시 목록 조회 실패:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 단일 공시 조회
  const fetchDisclosureById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const data = await disclosureApi.getDisclosureById(id);
      setSelectedDisclosure(data);
      return data;
    } catch (err) {
      setError(err.message || "단일 공시 조회 실패");
      console.error("단일 공시 조회 실패:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 공시 원문 URL 조회
  const fetchDisclosureDownloadUrl = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const data = await disclosureApi.getDisclosureDownloadUrl(id);
      setDownloadInfo(data);
      return data;
    } catch (err) {
      setError(err.message || "공시 원문 URL 조회 실패");
      console.error("공시 원문 URL 조회 실패:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 기업 목록 조회
  const fetchCompanies = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const data = await disclosureApi.getCompanies(params);

      setCompanies(data.companies ?? []);
      setCompanyListMeta({
        totalCount: data.totalCount ?? 0,
        page: data.page ?? 1,
        limit: data.limit ?? 20,
      });

      return data;
    } catch (err) {
      setError(err.message || "기업 목록 조회 실패");
      console.error("기업 목록 조회 실패:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 기업 검색
  const searchCompanies = useCallback(async (keyword) => {
    try {
      setLoading(true);
      setError(null);

      const data = await disclosureApi.searchCompanies(keyword);

      setSearchedCompanies(data.results ?? []);
      setSearchMeta({
        query: data.query ?? "",
        totalCount: data.totalCount ?? 0,
      });

      return data;
    } catch (err) {
      setError(err.message || "기업 검색 실패");
      console.error("기업 검색 실패:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 기업 상세 조회
  const fetchCompanyDetail = useCallback(async (corpCode) => {
    try {
      setLoading(true);
      setError(null);

      const data = await disclosureApi.getCompanyDetail(corpCode);
      setSelectedCompany(data);
      return data;
    } catch (err) {
      setError(err.message || "기업 상세 조회 실패");
      console.error("기업 상세 조회 실패:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      disclosures,
      disclosureListMeta,
      selectedDisclosure,
      downloadInfo,

      companies,
      companyListMeta,
      searchedCompanies,
      searchMeta,
      selectedCompany,

      loading,
      error,

      fetchDisclosures,
      fetchDisclosureById,
      fetchDisclosureDownloadUrl,
      fetchCompanies,
      searchCompanies,
      fetchCompanyDetail,
    }),
    [
      disclosures,
      disclosureListMeta,
      selectedDisclosure,
      downloadInfo,
      companies,
      companyListMeta,
      searchedCompanies,
      searchMeta,
      selectedCompany,
      loading,
      error,
      fetchDisclosures,
      fetchDisclosureById,
      fetchDisclosureDownloadUrl,
      fetchCompanies,
      searchCompanies,
      fetchCompanyDetail,
    ],
  );

  return (
    <DisclosureContext.Provider value={value}>
      {children}
    </DisclosureContext.Provider>
  );
};
