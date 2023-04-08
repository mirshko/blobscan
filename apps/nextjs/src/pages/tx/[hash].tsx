import type { NextPage } from "next";
import NextError from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Spinner,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { api } from "~/utils/api";

const Tx: NextPage = () => {
  const router = useRouter();
  const hash = router.query.hash as string;

  const txQuery = api.tx.byId.useQuery({ id: hash });

  if (txQuery.error) {
    return (
      <NextError
        title={txQuery.error.message}
        statusCode={txQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (txQuery.status !== "success") {
    return <Spinner />;
  }

  const { data: tx } = txQuery;

  return (
    <>
      <Box ml="20px">
        <Breadcrumb separator="-" fontWeight="medium" fontSize="md" mb="5px">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href={`/block/${tx.block}`}>
              Block #{tx.block}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Tx {tx.index}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as="h1" width="100%" mb="15px" fontSize="1.5rem">
          Transaction {tx.hash}
        </Heading>
        <Box mb="3px">
          <Tag mb="3px">From:</Tag>{" "}
          <Link href={`/address/${tx.from}`}>{tx.from}</Link>
        </Box>
        <Box mb="3px">
          <Tag mb="3px">To:</Tag>{" "}
          <Link href={`/address/${tx.to}`}>{tx.to}</Link>
        </Box>
      </Box>

      <Box>
        <Heading as="h2" width="xs" fontSize="1.2rem" mt="50px" ml="20px">
          Blobs
        </Heading>
        {tx.Blob.length == 0 ? (
          <Text ml="20px" mt="20px">
            No blobs in this transaction
          </Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Data Hash</Th>
                <Th>Size</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tx.Blob.map((blob) => {
                return (
                  <Tr key={blob.hash} fontSize="0.9rem">
                    <Td>
                      <Link href={`/blob/${blob.hash}`}>{blob.hash}</Link>
                    </Td>
                    <Td>{blob.data.length}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </Box>
    </>
  );
};

export default Tx;