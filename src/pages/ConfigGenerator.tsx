import { Card, Flex, Input, Select, Spin, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Config from "../components/Config";
import useLicense from "../store/useLicense";
import useProfile from "../store/useProfile";
import api from "../utils/api";
import { Guild } from "../types";
import React from "react";
import 'embed-visualizer/dist/index.css'

//@ts-ignore
import { EmbedVisualizer, parseContent, parseTitle } from 'embed-visualizer';
import DiscordEmbed from "../components/DiscordEmbed";

const DemoDefaults = {
  embed: {

    author: {
      name: 'TestUser',
        url: 'https://beepbot.app',
    },
    title: 'My Awesome Day Out',
    description: '## Testing\n This is a message on another line?',
    footer: {
        text: 'via BeepBot \\o\/',
    },
  }
};

const LicenseConfig = () => {
  const { id } = useParams();
  const { user, guilds, setGuilds } = useProfile();
  const {
    license,
    config,
    versions,
    currentVersion,
    guild,
    setGuildInfo,
    setLicense,
    setGuild,
    setCurrentVersion,
  } = useLicense();
  const { handleSubmit, control, reset, watch } = useForm({
    defaultValues: async () => config,
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [serverLoading, setServerLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const oauth = await api.getJWT();
      const fetchedGuilds = await api.getGuilds(oauth.accessToken);
      setGuilds(fetchedGuilds);

      const licenses = await api.getLicenses(user.id);
      const licenseData = licenses.find((license) => license.id == Number(id));
      if (licenseData) {
        setToken(licenseData.token || "");
        setLicense(licenseData);
        reset(JSON.parse(licenseData.config || "{}"));

        const guildData = fetchedGuilds.find((g: Guild) => g.id == licenseData.serverId);
        if (guildData) setGuild(guildData);

        if (licenseData.token) {
          const info = await api.getGuild(licenseData.id);
          setGuildInfo(info);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load license data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, id, setGuilds, setLicense, reset, setGuild, setGuildInfo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const subscription = watch(() => handleSubmit(updateConfig)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch, license]);

  const updateConfig = async (config: any) => {
    if (!license) return;
    try {
      await api.updateConfig(license.id, JSON.stringify(config));
    } catch (error) {
      console.error("Error updating config:", error);
      message.error("Failed to update configuration. Please try again.");
    }
  };

  const changeServer = async (serverId: string) => {
    if (!license) return;
    try {
      await api.changeServer(license.id, serverId);
      setGuild(guilds?.find((g) => g.id == serverId)!);
    } catch (error) {
      console.error("Error changing server:", error);
      message.error("Failed to change server. Please try again.");
    }
  };

  const changeVersion = async (versionId: number) => {
    if (!license) return;
    try {
      const result = await api.changeConfigVersion(license.id, versionId);
      setCurrentVersion(result);
    } catch (error) {
      console.error("Error changing version:", error);
      message.error("Failed to change version. Please try again.");
    }
  };

  const changeToken = async () => {
    if (!license || !token) return;
    setServerLoading(true);
    try {
      await api.changeToken(license.id, token);
      const info = await api.getGuild(license.id);
      setGuildInfo(info);
      message.success("Token updated successfully");
    } catch (error) {
      console.error("Error changing token:", error);
      message.error("Failed to update token. Please try again.");
    } finally {
      setServerLoading(false);
    }
  };

  if (loading) return <Spin spinning={loading} fullscreen />;


  return (
    <Flex vertical gap={10}>


      <Card
        style={{ overflow: "hidden" }}
        cover={
          guild && (
            <img
              style={{
                maxHeight: "200px",
                objectFit: "cover",
                filter: "blur(25px)",
              }}
              alt="Guild icon"
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=2048`}
            />
          )
        }
      >
        <Flex vertical gap={10}>
          {guild ? (
            <h1>{guild.name}</h1>
          ) : (
            <div>
              <h1>You haven't selected a server yet</h1>
              <p>Please note, you can only change the server once every 7 days</p>
            </div>
          )}

          <Select
            value={guild ? String(guild.id) : undefined}
            placeholder="Server"
            onChange={changeServer}
            options={guilds?.map((g) => ({
              value: String(g.id),
              label: g.name,
            }))}
          />

          <Input.Search
            placeholder="Token"
            enterButton="Update"
            size="large"
            type="password"
            loading={serverLoading}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onSearch={changeToken}
          />
        </Flex>
      </Card>

      <Card className="settings">
        <Flex gap={10} vertical>
          <Flex vertical>
            <h1>Settings</h1>
            <h2>{license?.product.title}</h2>
            <p>{license?.product.description}</p>
          </Flex>

          <Select
            value={currentVersion?.id || null}
            style={{ width: 250 }}
            placeholder="Version"
            options={versions?.map((version) => ({
              value: version.id,
              label: version.version,
            }))}
            onChange={changeVersion}
          />

          <EmbedVisualizer embed={DemoDefaults}  />
          <DiscordEmbed onGenerate={() => {}}/>
          {currentVersion ? (
            <Config control={control} config={currentVersion.config} />
          ) : (
            <h1>You haven't selected a product version yet</h1>
          )}
        </Flex>
      </Card>
    </Flex>
  );
};

export default LicenseConfig;
