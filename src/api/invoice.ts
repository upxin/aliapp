import { post, httpDelete } from '@/utils/index';

export function addInvoiceTitle(params) {
  return post({
    url: '/vehicle/bill/invoice/add',
    params,
  });
}

export function getInvoiceList(params) {
  return post({
    url: '/vehicle/bill/invoice/page',
    params,
  });
}

export function editInvoiceTitle(params) {
  return post({
    url: '/vehicle/bill/invoice/update',
    params,
  });
}

export function delInvoiceTitle(params) {
  return httpDelete({
    url: '/vehicle/bill/invoice/delete',
    params,
  });
}

export function openInvoice(params) {
  return post({
    url: '/vehicle/bill/open',
    params,
  });
}

export function getInvoiceRecorde(params) {
  return post({
    url: '/vehicle/bill/page',
    params,
  });
}
