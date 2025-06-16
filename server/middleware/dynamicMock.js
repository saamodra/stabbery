import { Mock } from '../models/Mock.js';
import { RequestLog } from '../models/RequestLog.js';

export const dynamicMockMiddleware = async (req, res, next) => {
  try {
    if (req.path.startsWith('/admin')) {
      return next();
    }

    const mocks = await Mock.findAllByPathAndMethod(req.path, req.method);

    const headersMatch = (mockHeaders, reqHeaders) => {
      for (const key in mockHeaders) {
        if (
          !reqHeaders ||
          typeof reqHeaders[key.toLowerCase()] === 'undefined' ||
          reqHeaders[key.toLowerCase()] != mockHeaders[key]
        ) {
          return false;
        }
      }
      return true;
    };

    const bodyMatch = (mockBody, reqBody) => {
      if (!mockBody || Object.keys(mockBody).length === 0) return true;
      for (const key in mockBody) {
        if (reqBody[key] !== mockBody[key]) return false;
      }
      return true;
    };

    let mock = null;
    for (const m of mocks) {
      const isHeadersMatch = headersMatch(m.request_headers, req.headers)
      const isBodyMatch = bodyMatch(m.request_body_schema, req.body);
      const isHeadersAndBodyMatch = isHeadersMatch && isBodyMatch;
      console.log(`Checking mock ${m.id} for ${req.method} ${req.path}: Headers Match: ${isHeadersMatch}, Body Match: ${isBodyMatch}`);
      if (
        isHeadersAndBodyMatch
      ) {
        mock = m;
        break;
      }
    }

    let response_status = 404;
    let response_body = { error: 'Route not found', message: `No mock endpoint configured for ${req.method} ${req.path}` };
    let response_headers = { 'Content-Type': 'application/json' };
    let matched_mock_id = null;

    if (mock) {
      response_status = mock.response_status;
      response_body = mock.response_body;
      response_headers = { ...response_headers, ...mock.response_headers };
      matched_mock_id = mock.id;
    }

    await RequestLog.create({
      method: req.method,
      path: req.path,
      headers: req.headers,
      body: req.body,
      response_status,
      response_body,
      matched_mock_id
    });

    Object.entries(response_headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    res.status(response_status).json(response_body);
  } catch (error) {
    console.error('Error in dynamic mock middleware:', error);
    next(error);
  }
};
